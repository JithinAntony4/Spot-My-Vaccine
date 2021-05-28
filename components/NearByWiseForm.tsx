import React, {useEffect, useState} from "react";
import theme from "../src/theme";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Typography} from "@material-ui/core";

interface AutocompleteInputType {
    place_id: string;
    description: string;
}

export default function NearByWiseForm({setLocation, setErrorMsg}) {

    const [stateListOpen, setStateListOpen] = React.useState(false);

    const [states, setStates] = React.useState<AutocompleteInputType[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [destinationPlaceId, setDestinationPlaceId] = useState('');
    const statesListLoading = stateListOpen && states.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!inputVal) {
            return undefined;
        }


        (async () => {
            const response = await fetch(`/api/places/get?inputType=${inputVal}`);
            if (response.status !== 200) return;
            let bodyJson = await response.json();
            let modeInputTypes: AutocompleteInputType[] = [];
            if (!bodyJson.predictions) return;
            if (active) {
                setStates(modeInputTypes);
                setStates(Object.keys(bodyJson.predictions).map((key) => bodyJson.predictions[key]) as AutocompleteInputType[]);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputVal]);


    useEffect(() => {
        //Fetch Place
        (async () => {
            try {
                if (!destinationPlaceId) return;
                let placeDetRes = await fetch(`/api/places/${destinationPlaceId}/get`);
                let placeDet = await placeDetRes.json();
                if (!placeDet.result.address_components) return;
                placeDet.result.address_components.forEach(component => {
                    if (!component.types) return;
                    if (component.types.length <= 0) return;
                    if (placeDet.result.geometry)
                        if (placeDet.result.geometry.location)
                            if (placeDet.result.geometry.location.lat && placeDet.result.geometry.location.lng)
                                setLocation(`${placeDet.result.geometry.location.lat},${placeDet.result.geometry.location.lng}`)
                    switch (component.types[0]) {
                        case "administrative_area_level_1":
                            // onCityNameChange(component.long_name)
                            break;
                        case "administrative_area_level_2":
                            // onCityNameChange(component.long_name)
                            break;
                        case "country":
                            // onCountryNameChange(component.long_name)
                            break;
                    }
                    switch (component.types[1]) {
                        case "sublocality":
                            // setDeliverySubLocality(component.long_name)
                            break;
                    }
                })
                // setAddress(placeDet.result.formatted_address)
                // setPlace(inputVal);
            } catch (e) {
                //console.log(e)
            }
        })();
    }, [destinationPlaceId])


    React.useEffect(() => {
        if (!stateListOpen) {
            setStates([]);
        }
    }, [stateListOpen]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                try {
                    setLocation(`${position.coords.latitude},${position.coords.longitude}`)
                } catch (e) {
                    setErrorMsg("Unable to fetch current location")
                }
            })
        }
    }, [])

    return (
        <>
            <Typography style={{padding: theme.spacing(0, 2, 0, 2)}} color={"textSecondary"} variant={"caption"}
                        align={"left"}>
                Get near by Vaccine Centers
            </Typography>

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
                        setDestinationPlaceId(value.place_id)
                    else {
                        setStateListOpen(false)
                        setDestinationPlaceId("")
                    }
                }}
                getOptionSelected={(option, value) => option.description === value.description}
                getOptionLabel={(option) => option.description}
                options={states}
                loading={statesListLoading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin={"dense"}
                        onChange={event => setInputVal(event.target.value)}
                        size={"small"}
                        label="Search Location for vaccination"
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
        </>
    )
}


