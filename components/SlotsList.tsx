import React, {useEffect, useState} from "react";
import {ListItemText} from "@material-ui/core";
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

export type Slot = {
    id: string;
    date: string;
    noOfSlots: number;
}

export default function SlotsList({selectedDistrictId, pincode, underFortyFive, aboveFortyFive, isCovisheild, isCovaxin, isSputnikV, isFree, isPaid, selectedDistrictName}) {
    let router = useRouter();
    const [slots, setSlots] = React.useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setSlots([]);
            if (!selectedDistrictId && !pincode) return;
            setLoading(true);
            let slots: Slot[] = [];
            let date = getCurrentFormattedDate();
            let response;
            if (selectedDistrictId)
                response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${selectedDistrictId}&date=${date}`);
            else if (pincode)
                response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`);
            else return;
            setLoading(false);
            if (response.status !== 200) return;
            let body = await response.json();

            body.centers.forEach(center => {
                if (isPaid && center.fee_type !== "Paid") return;
                if (isFree && center.fee_type !== "Free") return;
                center.sessions.forEach(session => {
                    if (underFortyFive && session.min_age_limit !== 18) return;
                    if (aboveFortyFive && session.min_age_limit !== 45) return;
                    if (isCovaxin && session.vaccine !== "COVAXIN") return;
                    if (isCovisheild && session.vaccine !== "COVISHIELD") return;
                    if (isSputnikV && session.vaccine !== "SPUTNIKV") return;
                    let availableCapacity = !isNaN(session.available_capacity) ? session.available_capacity : 0;
                    let slot = slots.find(value => value.date === session.date);
                    if (slot) {
                        if (!isNaN(availableCapacity))
                            slot.noOfSlots += Number(availableCapacity)
                    } else {
                        slots.push({
                            noOfSlots: Number(availableCapacity),
                            date: session.date,
                            id: center.center_id
                        })
                    }
                })
            })
            setSlots(slots);
        })();

    }, [selectedDistrictId, pincode, underFortyFive, aboveFortyFive, isCovisheild, isCovaxin, isFree, isPaid, isSputnikV])

    return (
        <Container>
            <List>
                {loading &&
                <LoadingView number={3}/>
                }
                {(slots.length <= 0 && (selectedDistrictId || pincode)) &&
                <EmptyListView/>
                }
                {slots.map((value, index) => {
                    let noOfSlots = value.noOfSlots;
                    let isHaveNoSlot = noOfSlots <= 0;
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
                })}
            </List>
        </Container>
    )
}


