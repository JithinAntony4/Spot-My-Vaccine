import React, {useEffect, useState} from "react";
import {Grid, ListItemText} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Container from "@material-ui/core/Container";
import {getCurrentFormattedDate, reverseFormattedDate} from "../lib/dateUtils";
import Typography from "@material-ui/core/Typography";
import {green} from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import theme from "../src/theme";
import {useRouter} from "next/router";
import EmptyListView from "./EmptyListView";
import LoadingView from "./LoadingView";
import dateLib from 'date-and-time';
import {isFilteredCenter, isFilteredSession} from "../lib/utils";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";

export type Slot = {
    id: string;
    date: string;
    noOfSlots: number;
    name: string;
    location: string;
    pincode: string;
    blockName: string;
}

function SlotListItem({router, index, selectedDistrictId, pincode, selectedDistrictName, value, isHaveNoSlot, noOfSlots}) {
    return <Paper style={{margin: theme.spacing(2, 0, 2, 0)}} variant={"outlined"}>
        <ListItem onClick={event => {
            router.push(`/day?districtId=${selectedDistrictId}&pincode=${pincode}&districtName=${selectedDistrictName}&date=${value.date}`)
        }} key={index} button>
            <ListItemText primary={
                <React.Fragment>
                    <Typography variant={"h6"}
                                color={"textSecondary"}>
                        <b>
                            {dateLib.format(new Date(reverseFormattedDate(value.date)), 'MMM DD, dddd')}
                        </b>
                    </Typography>
                </React.Fragment>
            }/>
            <ListItemText secondary={
                <React.Fragment>
                    <Typography style={{color: !isHaveNoSlot && green["A400"]}} variant={"caption"}
                                color={isHaveNoSlot ? "textSecondary" : "initial"}>
                        <b>
                            {isHaveNoSlot ? "No Slots" : `${noOfSlots} Slots`}
                        </b>
                    </Typography>
                </React.Fragment>
            }/>
            <ListItemSecondaryAction>
                <ArrowForwardIosRoundedIcon fontSize={"small"} color={"disabled"}/>
            </ListItemSecondaryAction>
        </ListItem>
    </Paper>
}

function NearBySlotListItem({router, index, value}) {

    const [slots, setSlots] = useState<Slot[]>();
    const [isHaveNoSlot, setIsHaveNoSlot] = useState(false);
    const [noOfSlots, setNoOfSlots] = useState(0);

    useEffect(() => {
        if (!value) return;
        (async () => {
            let date = getCurrentFormattedDate();
            let response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=${value.id}&date=${date}`);
            if (response.status !== 200) return;
            let body = await response.json();
            let slotsTemp: Slot[] = [];
            let center = body.centers || {};
            let sessions = center.sessions || [];
            sessions.forEach(session => {
                let availableCapacity = !isNaN(session.available_capacity) ? session.available_capacity : 0;
                if (availableCapacity > 0) {
                    slotsTemp.push({
                        location: '',
                        pincode: center.pincode,
                        blockName: center.block_name,
                        name: center.name,
                        noOfSlots: Number(availableCapacity),
                        date: session.date,
                        id: center.center_id
                    })
                }
            })
            setSlots(slotsTemp);
        })();
    }, [value])

    useEffect(() => {
        if (!slots) return;
        let temp = 0;
        slots.forEach(value1 => temp += value1.noOfSlots);
        setNoOfSlots(temp);
        setIsHaveNoSlot(slots.length <= 0);
    }, [slots])

    return <Paper style={{margin: theme.spacing(2, 0, 2, 0)}}
                  variant={"outlined"}>
        <ListItem onClick={event => {
            router.push(`/day?centerId=${value.id}&centerName=${value.name}`)
        }} key={index} button>
            <ListItemText primary={
                <React.Fragment>
                    <Typography noWrap variant={"h6"}
                                color={"textSecondary"}>
                        <b>
                            {value.name} {(slots && slots.length > 0) &&
                        <Typography noWrap style={{color: !isHaveNoSlot && green["A400"]}}
                                    variant={"caption"}
                                    color={isHaveNoSlot ? "textSecondary" : "initial"}>
                            (
                            <b>
                                {isHaveNoSlot ? "No Slots" : `${noOfSlots} Slots`}
                            </b>
                            )
                        </Typography>
                        }
                        </b>
                    </Typography>
                    <Grid container spacing={1} direction={"row"} alignItems={"center"}>
                        <Grid item xs={1}>
                            <LocationOnRoundedIcon fontSize={"small"}/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography variant={"caption"}
                                        color={"textSecondary"}>
                                <b>
                                    {value.location}
                                </b>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant={"caption"}
                                color={"textSecondary"}>
                        <b>
                            {value.blockName}, {value.pincode}
                        </b>
                    </Typography>
                </React.Fragment>
            }/>
            <ListItemSecondaryAction>
                <ArrowForwardIosRoundedIcon fontSize={"small"} color={"disabled"}/>
            </ListItemSecondaryAction>
        </ListItem>
    </Paper>
}

export default function SlotsList({selectedDistrictId, pincode, underFortyFive, aboveFortyFive, isCovisheild, isCovaxin, isSputnikV, isFree, isPaid, selectedDistrictName, location}) {
    let router = useRouter();
    const [slots, setSlots] = React.useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setSlots([]);
            if (!selectedDistrictId && !pincode && !location) return;
            setLoading(true);
            let slots: Slot[] = [];
            let date = getCurrentFormattedDate();
            let response;
            if (selectedDistrictId)
                response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${selectedDistrictId}&date=${date}`);
            else if (pincode)
                response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`);
            else if (location) {
                let arr = location.split(',');
                let latitude = arr[0];
                let longitude = arr[1];
                let precision = 4
                response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/centers/public/findByLatLong?lat=${Math.fround(latitude).toPrecision(precision)}&long=${Math.fround(longitude).toPrecision(precision)}`);
            } else return;
            setLoading(false);
            if (response.status !== 200) return;
            let body = await response.json();

            body.centers.forEach(center => {
                if (!isFilteredCenter({isFree: isFree, isPaid: isPaid, center: center})) return;
                if (location) {
                    slots.push({
                        blockName: center.block_name,
                        pincode: center.pincode,
                        date: '',
                        noOfSlots: 0,
                        id: center.center_id,
                        name: center.name,
                        location: center.location,
                    })
                } else {
                    center.sessions.forEach(session => {
                        if (!isFilteredSession({
                            underFortyFive,
                            aboveFortyFive,
                            session,
                            isCovaxin,
                            isCovisheild,
                            isSputnikV
                        })) return;
                        let availableCapacity = !isNaN(session.available_capacity) ? session.available_capacity : 0;
                        let slot = slots.find(value => value.date === session.date);
                        if (slot) {
                            if (!isNaN(availableCapacity))
                                slot.noOfSlots += Number(availableCapacity)
                        } else {
                            slots.push({
                                location: '',
                                pincode: center.pincode,
                                blockName: center.block_name,
                                name: center.name,
                                noOfSlots: Number(availableCapacity),
                                date: session.date,
                                id: center.center_id
                            })
                        }
                    })
                }
            })
            setSlots(slots);
        })();

    }, [selectedDistrictId, pincode, underFortyFive, aboveFortyFive, isCovisheild, isCovaxin, isFree, isPaid, isSputnikV, location])

    return (
        <Container>
            <List>
                {loading &&
                <LoadingView number={3}/>
                }
                {(slots.length <= 0 && (selectedDistrictId || pincode) && !loading) &&
                <EmptyListView/>
                }
                {slots.map((value, index) => {
                    let noOfSlots = value.noOfSlots;
                    let isHaveNoSlot = noOfSlots <= 0;
                    return location ?
                        <NearBySlotListItem router={router} index={index}
                                            value={value}/> :
                        <SlotListItem router={router} index={index} isHaveNoSlot={isHaveNoSlot} noOfSlots={noOfSlots}
                                      pincode={pincode} value={value} selectedDistrictId={selectedDistrictId}
                                      selectedDistrictName={selectedDistrictName}/>
                })}
            </List>
        </Container>
    )
}


