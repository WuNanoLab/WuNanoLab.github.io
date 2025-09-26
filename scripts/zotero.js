async function getPDF() {
    const regex = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let urls = {};
    for ([_, label, pageURL] of md.matchAll(regex)) {
        // const id = Zotero.Utilities.extractIdentifiers(link);
        const fileName = label.replace(/[\/:\s]/g, '_');
        const tmpFile = `~/Downloads/att/${fileName}.pdf`;
        const result = await Zotero.Attachments.downloadFirstAvailableFile(
            [{ pageURL }],
            tmpFile,
            {
                onRequestError: function (error) {
                    console.debug(fileName);
                    console.error(error);
                },
                onAfterRequest: function (url) {
                    urls[label] = url;
                    console.log(`Downloaded attachment from ${url} to ${tmpFile}`);
                }
            }
        );
        console.info(result);
        // if (result) {
        //     md = md.replace(
        //         new RegExp(`\\[${label}\\]\\(${pageURL}\\)`),
        //         `[![](/assets/img/download.svg)](/assets/att/${fileName}.pdf)`
        //     );
        // }
    }
    console.log(urls);
}