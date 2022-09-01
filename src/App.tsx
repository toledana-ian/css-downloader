import React, {useEffect, useRef, useState} from 'react';
import domtoimage from 'dom-to-image';

interface CanVasSizeModel {
    width: number,
    height: number
}

function App() {
    const refCanvas = useRef<HTMLDivElement | null>(null);

    const [inputCanvasSize, setInputCanvasSize] = useState<CanVasSizeModel>({width: 200, height: 200});
    const [inputCss, setInputCss] = useState('background: rgb(118,118,193);');

    const [canvasSize, setCanvasSize] = useState<CanVasSizeModel>({width: 200, height: 200});
    const [css, setCss] = useState('');

    const getCssStyleToObject = (input: string) => {
        let output = {};

        const styles = input.replaceAll('\n', '').split(';').filter(n => n);

        styles.map((style) => {
            if (style.split(':').length === 1) return 0;

            let key = style.split(':')[0].trim();
            const value = style.split(':')[1].trim();

            key = key.split('-').map((keyDatum, keyDatumIndex) => {
                if (keyDatumIndex === 0) return keyDatum;
                return keyDatum.charAt(0).toUpperCase() + keyDatum.slice(1);
            }).join('');

            const object = JSON.parse('{"' + key + '":"' + value + '"}')
            output = {...output, ...object}

            return 0;
        });

        return output;
    }

    const onClickDownload = () => {
        domtoimage
            .toPng(refCanvas.current!)
            .then(function (dataUrl) {
                let link = document.createElement('a');
                link.download = 'gradient-generator.jpeg';
                link.href = dataUrl;
                link.click();
            })
    }

    useEffect(() => {
        if (inputCanvasSize.width > 0 && inputCanvasSize.height > 0)
            setCanvasSize(inputCanvasSize)
    }, [inputCanvasSize]);

    useEffect(() => {
        if (!inputCss.includes('"'))
            setCss(inputCss);
    }, [inputCss])

    return (
        <div className="App">
            <div className={'container mx-auto p-2'}>

                <div
                    className="w-full bg-white rounded-lg border border-gray-200 shadow-md">
                    <div className={'flex w-full min-h-[500px] bg-gray-200'}>
                        <div className={'flex flex-col gap-2 my-auto mx-auto p-2'}>
                            <div className={'border border-2 border-black'}>
                                <div
                                    ref={refCanvas}
                                    style={{
                                        width: canvasSize.width,
                                        height: canvasSize.height,
                                        ...getCssStyleToObject(css)
                                    }}
                                />
                            </div>

                            <div className={'mx-auto'}>
                                <button
                                    type="button"
                                    className="text-white bg-[#050708] hover:bg-[#050708]/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                    onClick={onClickDownload}
                                >
                                    Download
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col gap-2 p-2">
                        <div className={'flex flex-col w-52 mx-auto'}>
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 text-center">
                                Canvas Size
                            </label>

                            <div className={'flex gap-2'}>
                                <input
                                    type="number" id="first_name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-center"
                                    value={inputCanvasSize.width}
                                    onChange={(e) => setInputCanvasSize({
                                        ...inputCanvasSize,
                                        width: parseInt(e.target.value)
                                    })}
                                />
                                <div className={'my-auto'}>x</div>
                                <input
                                    type="number" id="first_name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-center"
                                    value={inputCanvasSize.height}
                                    onChange={(e) => setInputCanvasSize({
                                        ...inputCanvasSize,
                                        height: parseInt(e.target.value)
                                    })}
                                />
                            </div>
                        </div>
                        <div className={'w-full max-w-[500px] mx-auto'}>
                            <label htmlFor="message"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">CSS
                                Code</label>
                            <textarea
                                rows={8}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                                onChange={e => setInputCss(e.target.value)}
                                value={inputCss}
                            >

                            </textarea>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
