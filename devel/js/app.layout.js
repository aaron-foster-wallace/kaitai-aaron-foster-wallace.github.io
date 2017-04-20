define(["require", "exports", "goldenlayout", "./HexViewer"], function (require, exports, GoldenLayout, HexViewer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var myLayout = new GoldenLayout({
        settings: { showCloseIcon: false, showPopoutIcon: false },
        content: [
            { type: 'row', content: []
                    .concat({ type: 'component', componentName: 'fileTreeCont', title: 'files', isClosable: false, width: 12 })
                    .concat({ type: 'column', id: 'mainArea', isClosable: false, content: [
                        { type: 'row', content: [
                                { type: 'column', content: [
                                        { type: 'component', componentName: 'ksyEditor', title: '.ksy editor', isClosable: false },
                                        { type: 'stack', activeItemIndex: 0, content: [
                                                { type: 'component', componentName: 'parsedDataTree', title: 'object tree', isClosable: false },
                                            ] },
                                    ] },
                                { type: 'stack', id: 'codeTab', activeItemIndex: 2, content: [
                                        { type: 'component', componentName: 'genCodeViewer', title: 'JS code', isClosable: false },
                                        { type: 'component', componentName: 'genCodeDebugViewer', title: 'JS code (debug)', isClosable: false },
                                        { type: 'column', isClosable: false, id: "inputBinaryTab", title: 'input binary', content: [
                                                { type: 'component', componentName: 'hexViewer', title: 'hex viewer', isClosable: false },
                                                { type: 'row', isClosable: false, height: 35, content: [
                                                        { type: 'component', componentName: 'infoPanel', title: 'info panel', isClosable: false, width: 40 },
                                                        { type: 'component', componentName: 'converterPanel', title: 'converter', isClosable: false },
                                                    ] }
                                            ] }
                                    ] }
                            ] },
                    ]
                })
            }
        ]
    });
    function getLayoutNodeById(id) {
        return myLayout._getAllContentItems().filter((x) => x.config.id === id || x.componentName === id)[0];
    }
    exports.getLayoutNodeById = getLayoutNodeById;
    var dynCompId = 1;
    function addEditorTab(title, data, lang = null, parent = 'codeTab') {
        var componentName = `dynComp${dynCompId++}`;
        addEditor(componentName, lang, true, (editor) => editor.setValue(data, -1));
        getLayoutNodeById(parent).addChild({ type: 'component', componentName, title });
    }
    exports.addEditorTab = addEditorTab;
    var ui = {
        layout: myLayout,
        ksyEditor: null,
        genCodeViewer: null,
        genCodeDebugViewer: null,
        //parsedDataViewer: <AceAjax.Editor>null,
        parsedDataTreeCont: null,
        parsedDataTreeHandler: null,
        hexViewer: null,
        errorWindow: null,
        infoPanel: null,
        fileTreeCont: null,
        fileTree: null,
        converterPanel: null,
        unparsedIntSel: null,
        bytesIntSel: null,
    };
    exports.ui = ui;
    function addComponent(name, generatorCallback) {
        var editor;
        myLayout.registerComponent(name, function (container, componentState) {
            //console.log('addComponent id', name, container.getElement());
            container.getElement().attr('id', name);
            if (generatorCallback) {
                container.on('resize', () => { if (editor && editor.resize)
                    editor.resize(); });
                container.on('open', () => { ui[name] = editor = generatorCallback(container) || container; });
            }
            else
                ui[name + 'Cont'] = container;
        });
    }
    function addExistingDiv(name) {
        myLayout.registerComponent(name, function (container, componentState) {
            ui[name + 'Cont'] = container;
            ui[name] = $(`#${name}`).appendTo(container.getElement());
            $(() => ui[name].show());
        });
    }
    function addEditor(name, lang, isReadOnly = false, callback = null) {
        addComponent(name, container => {
            var editor = ace.edit(container.getElement().get(0));
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode(`ace/mode/${lang}`);
            if (lang === 'yaml')
                editor.setOption('tabSize', 2);
            editor.$blockScrolling = Infinity; // TODO: remove this line after they fix ACE not to throw warning to the console
            editor.setReadOnly(isReadOnly);
            if (callback)
                callback(editor);
            return editor;
        });
    }
    addEditor('ksyEditor', 'yaml');
    addEditor('genCodeViewer', 'javascript', true);
    addEditor('genCodeDebugViewer', 'javascript', false);
    //addEditor('parsedDataViewer', 'javascript', true);
    addComponent('hexViewer', () => new HexViewer_1.HexViewer("hexViewer"));
    addComponent('errorWindow', cont => { cont.getElement().append($("<div />")); });
    addComponent('parsedDataTree');
    addComponent('fileTreeCont', cont => cont.getElement().append($("#fileTreeCont").children()));
    addExistingDiv('infoPanel');
    addExistingDiv('converterPanel');
    myLayout.init();
});
//# sourceMappingURL=app.layout.js.map