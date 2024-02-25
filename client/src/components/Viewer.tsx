/// import * as Autodesk from "@types/forge-viewer";

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const { Autodesk } = window;

interface runtimeT {
    options: Autodesk.Viewing.InitializerOptions | null;
    ready: Promise<void> | null;
}

const runtime: runtimeT = {
    options: null,
    ready: null
};


// Autodesk Platform Services と通信するためのグローバル ランタイムを初期化します。
// 異なるオプションを指定してこの関数を繰り返し呼び出すことは許可されておらず、例外が発生します。
function initializeViewerRuntime(
    options: Autodesk.Viewing.InitializerOptions): Promise<void> {
    if (!runtime.ready) {
        runtime.options = { ...options };
        runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options!, resolve));
    } else {
        if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some(prop => options[prop] !== runtime.options![prop])) {
            return Promise.reject('Cannot initialize another viewer runtime with different settings.')
        }
    }
    return runtime.ready;
}


// Autodesk Platform Services ビューア コンポーネントのラッパー。
interface propT {
    runtime: Autodesk.Viewing.InitializerOptions; // Viewer runtime initialization options.
    urn: string;                    // URN of model to be loaded.
    selectedIds: number[];
    onCameraChange: any;
    onSelectionChange: any;
}

export default function Viewer(props: propT) {

    let container: HTMLDivElement | null = null;
    let viewer: Autodesk.Viewing.GuiViewer3D | null = null;

    useEffect(() => {

        if (viewer) {
            // componentDidUpdate
            updateViewerState(props);
        } else {
            // componentDidMount
            initializeViewerRuntime(props.runtime || {})
                .then(_ => {
                    viewer = new Autodesk.Viewing.GuiViewer3D(container!);
                    viewer.start();
                    viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, onViewerCameraChange);
                    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onViewerSelectionChange);
                    updateViewerState({});
                })
                .catch(err => console.error(err));
        }

        return () => {
            // componentWillUnmount
            if (viewer) {
                viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, onViewerCameraChange);
                viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onViewerSelectionChange);
                viewer.finish();
                viewer = null;
            }
        }
    }, [])

    const updateViewerState = (prevProps: propT | any) => {
        if (props.urn && props.urn !== prevProps.urn) {
            Autodesk.Viewing.Document.load(
                'urn:' + props.urn,
                (doc) => viewer!.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()),
                (code, message, errors) => console.error(code, message, errors)
            );
        } else if (!props.urn && viewer!.model) {
            viewer!.unloadModel(viewer!.model);
        }

        const selectedIds = viewer!.getSelection();
        if (JSON.stringify(props.selectedIds || []) !== JSON.stringify(selectedIds)) {
            viewer!.select(props.selectedIds);
        }
    }

    const onViewerCameraChange = () => {
        if (props.onCameraChange) {
          props.onCameraChange({ viewer: viewer, camera: viewer!.getCamera() });
        }
      }

    const onViewerSelectionChange = () => {
        if (props.onSelectionChange) {
          props.onSelectionChange({ viewer: viewer, ids: viewer!.getSelection() });
        }
    }

    return ( 
        <div ref={ ref => container = ref }> </div>
    );
}

