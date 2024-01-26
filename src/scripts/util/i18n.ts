/**
 *
 * @param loc_path path to the csv file relative to the root of the project.
 * @returns loc sheet.
 */
export function parse(csv: string) {
    const data = CSVToArray(csv);
    const loc: Record<string, Record<string, string>> = {};

    try {
        const langs = data[0];

        for (let i = 1; i < langs.length; i++) {
            const lang = langs[i];

            loc[lang] = {};
        }

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const key = row[0];

            // start from 1 because 1 val in langs (row 0) is "name", not a lang
            for (let f = 1; f < langs.length; f++) {
                const lang = langs[f];

                const val = row[f];
                loc[lang][key] = val.replace(/\\n/g, "\n");
            }
        }

        return loc;
    } catch (err) {
        console.error(
            `Something went wrong, check if 1) Path is correct; 2) Csv file is valid. Error: ${err}`
        );

        return {};
    }
}

let all_langs_dict: Record<string, Record<string, string>>;

export async function init_dictionary(lang: string, path: string) {
    const csv = await fetch(path).then((res) => res.text());
    if (!csv) throw new Error("Could not load dictionary");

    all_langs_dict = parse(csv);

    const prefered_lang_dict = all_langs_dict[lang];

    if (prefered_lang_dict) return prefered_lang_dict;

    return all_langs_dict["en"];
}

export function update_dictionary(lang: string) {
    const prefered_lang_dict = all_langs_dict[lang];

    if (prefered_lang_dict) return prefered_lang_dict;

    return all_langs_dict["en"];
}

/* https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm */
function CSVToArray(strData: string, strDelimiter = ",") {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";

    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
        // Delimiters.
        "(\\" +
            strDelimiter +
            "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            '(?:"([^"]*(?:""[^"]*)*)"|' +
            // Standard fields.
            '([^"\\' +
            strDelimiter +
            "\\r\\n]*))",
        "gi"
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]] as string[][];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches: RegExpExecArray | null = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        let strMatchedValue = "";
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
}
