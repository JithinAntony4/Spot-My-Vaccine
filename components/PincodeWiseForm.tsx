import React from "react";
import theme from "../src/theme";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

interface AutocompleteInputType {
    id: string;
    name: string;
}

export default function PincodeWiseForm({selectedPincode, setSelectedPincode}) {

    const [pincodeListOpen, setPincodeListOpen] = React.useState(false);

    const [pincodes, setPincodes] = React.useState<AutocompleteInputType[]>([]);
    const loading = pincodeListOpen && pincodes.length === 0;
    const [inputVal, setInputVal] = React.useState('');


    function genPincode(value: string): AutocompleteInputType[] {
        const totalLen = 6;
        if (!value) return [];
        if (value.length == totalLen) return [{
            id: value,
            name: value
        }];
        else if (value.length > totalLen) return;
        let result = [];
        while (value.length <= 5) {
            value += "0";
        }
        for (let i = 0; i < 10; i++) {
            result.push({
                id: `${Number(value) + i}`,
                name: `${Number(value) + i}`
            })
        }
        return result
    }

    React.useEffect(() => {
        let active = true;

        if (!loading && !inputVal) {
            setPincodeListOpen(false);
            return undefined;
        }

        (async () => {
            let bodyJson = genPincode(inputVal);
            let modeInputTypes: AutocompleteInputType[] = [];
            if (!bodyJson) return;
            bodyJson.forEach(value => {
                modeInputTypes.push(value)
            })

            if (bodyJson.length > 0)
                setPincodeListOpen(true);

            if (active) {
                setPincodes(modeInputTypes);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputVal]);


    React.useEffect(() => {
        if (!pincodeListOpen) {
            setPincodes([]);
        }
    }, [pincodeListOpen]);

    return (
        <>
            <Autocomplete
                size={"small"}
                style={{marginTop: theme.spacing(1), padding: theme.spacing(0, 3, 0, 3)}}
                fullWidth
                open={pincodeListOpen}
                onOpen={() => {
                    // setPincodeListOpen(true);
                }}
                onClose={() => {
                    setPincodeListOpen(false);
                }}
                onChange={(event, value: AutocompleteInputType) => {
                    if (value) {
                        setSelectedPincode(value.id)
                        setPincodeListOpen(false);
                    } else
                        setSelectedPincode("");
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={pincodes}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        value={selectedPincode}
                        margin={"dense"}
                        size={"small"}
                        onChange={event => setInputVal(event.target.value)}
                        label="Select Pincode"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />


            {/*<Box style={{padding: theme.spacing(3, 3, 3, 3)}}>
                <Button onClick={event => onSubmit()} disabled={!selectedPincode} fullWidth
                        variant={"contained"}
                        color={"secondary"}>Search
                    Slots</Button>
            </Box>*/}
        </>
    )
}


