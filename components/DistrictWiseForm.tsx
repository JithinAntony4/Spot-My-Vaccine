import React from "react";
import theme from "../src/theme";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

interface AutocompleteInputType {
    id: string;
    name: string;
}

export default function DistrictWiseForm({selectedStateId, setSelectedStateId, setSelectedDistrictId, setSelectedDistrictName}) {

    const [stateListOpen, setStateListOpen] = React.useState(false);
    const [districtListOpen, setDistrictListOpen] = React.useState(false);

    const [states, setStates] = React.useState<AutocompleteInputType[]>([]);
    const [districts, setDistricts] = React.useState<AutocompleteInputType[]>([]);
    const statesListLoading = stateListOpen && states.length === 0;
    const districtsListLoading = districtListOpen && districts.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!statesListLoading) {
            return undefined;
        }

        (async () => {
            //TODO move to .env or config file
            const response = await fetch('https://cdn-api.co-vin.in/api/v2/admin/location/states');
            if (response.status !== 200) return;
            let bodyJson = await response.json();
            let modeInputTypes: AutocompleteInputType[] = [];
            bodyJson.states.forEach(value => {
                modeInputTypes.push({
                    name: value.state_name,
                    id: value.state_id
                })
            })

            if (active) {
                setStates(modeInputTypes);
            }
        })();

        return () => {
            active = false;
        };
    }, [statesListLoading]);


    React.useEffect(() => {
        let active = true;

        if (!districtsListLoading) {
            return undefined;
        }

        (async () => {
            //TODO move to .env or config file
            const response = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${selectedStateId}`);
            if (response.status !== 200) return;
            let bodyJson = await response.json();
            let modeInputTypes: AutocompleteInputType[] = [];
            bodyJson.districts.forEach(value => {
                modeInputTypes.push({
                    name: value.district_name,
                    id: value.district_id
                })
            })

            if (active) {
                setDistricts(modeInputTypes);
            }
        })();

        return () => {
            active = false;
        };
    }, [districtsListLoading, selectedStateId]);

    React.useEffect(() => {
        if (!stateListOpen) {
            setStates([]);
        }
    }, [stateListOpen]);

    React.useEffect(() => {
        if (!districtListOpen) {
            setDistricts([]);
        }
    }, [districtListOpen]);

    return (
        <>
            <Autocomplete
                size={"small"}
                style={{marginTop: theme.spacing(1), padding: theme.spacing(0, 3, 0, 3)}}
                fullWidth
                open={stateListOpen}
                onOpen={() => {
                    setStateListOpen(true);
                }}
                onClose={() => {
                    setStateListOpen(false);
                }}
                onChange={(event, value: AutocompleteInputType) => {
                    if (value)
                        setSelectedStateId(value.id)
                    else {
                        setStateListOpen(false)
                        setSelectedStateId("")
                        setSelectedDistrictId("")
                        setSelectedDistrictName("")
                    }
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={states}
                loading={statesListLoading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin={"dense"}
                        size={"small"}
                        label="Select State"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {statesListLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />

            <Autocomplete
                style={{marginTop: theme.spacing(1), padding: theme.spacing(0, 3, 0, 3)}}
                size={"small"}
                fullWidth
                open={districtListOpen}
                onOpen={() => {
                    setDistrictListOpen(true);
                }}
                onClose={() => {
                    setDistrictListOpen(false);
                }}
                onChange={(event, value: AutocompleteInputType) => {
                    if (value) {
                        setSelectedDistrictId(value.id)
                        setSelectedDistrictName(value.name)
                    } else {
                        setDistrictListOpen(false);
                        setSelectedDistrictId("")
                        setSelectedDistrictName("")
                    }
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={districts}
                loading={districtsListLoading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin={"dense"}
                        size={"small"}
                        label="Select District"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {statesListLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />

            {/* <Box style={{padding: theme.spacing(3, 3, 3, 3)}}>
                <Button onClick={event => onSubmit()} disabled={!selectedStateId || !selectedDistrictId} fullWidth
                        variant={"contained"}
                        color={"secondary"}>Search
                    Slots</Button>
            </Box>*/}
        </>
    )
}


