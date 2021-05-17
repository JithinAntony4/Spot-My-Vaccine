import React, {useEffect, useState} from "react";
import {Chip, Grid, ListItemText} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Container from "@material-ui/core/Container";
import {getCurrentFormattedDate} from "../lib/dateUtils";
import Typography from "@material-ui/core/Typography";
import {green} from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import theme from "../src/theme";
import {useRouter} from "next/router";
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import red from "@material-ui/core/colors/red";
import Button from "@material-ui/core/Button";
import LoadingView from "./LoadingView";
import EmptyListView from "./EmptyListView";

export type SlotByDay = {
    name: string;
    blockName: string;
    pinCode: string;
    vaccine: string;
    noOfSlots: number;
    price: number;
    age: number;
}

export default function SlotsByDayWiseList({
                                               selectedDistrictId, pincode, underFortyFive, aboveFortyFive, isCovisheild,
                                               isCovaxin, isSputnikV, isFree, isPaid, date, hospitalName
                                           }) {
    let router = useRouter();
    const [slots, setSlots] = React.useState<SlotByDay[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setSlots([]);
            if (!selectedDistrictId && !pincode) return;
            setLoading(true);
            let slots: SlotByDay[] = [];
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
                if (hospitalName && !center.name.includes(hospitalName)) return;
                if (isPaid && center.fee_type !== "Paid") return;
                if (isFree && center.fee_type !== "Free") return;
                let slotTemp: SlotByDay = {
                    name: center.name,
                    blockName: center.block_name,
                    pinCode: center.pincode,
                    noOfSlots: 0,
                    vaccine: '',
                    age: 0,
                    price: 0
                }
                let vaccineFees = center.vaccine_fees ? center.vaccine_fees : [];
                let isHaveValidSession = false;
                center.sessions.forEach(session => {
                    if (underFortyFive && session.min_age_limit !== 18) return;
                    if (aboveFortyFive && session.min_age_limit !== 45) return;
                    if (isCovaxin && session.vaccine !== "COVAXIN") return;
                    if (isCovisheild && session.vaccine !== "COVISHIELD") return;
                    if (isSputnikV && session.vaccine !== "SPUTNIKV") return;
                    let availableCapacity = !isNaN(session.available_capacity) ? session.available_capacity : 0;
                    if (session.date !== date) return;
                    let find = vaccineFees.filter(value => value.vaccine === session.vaccine) || [];
                    isHaveValidSession = true;
                    slotTemp.price = find.length > 0 ? Number(find[0].fee) : 0;
                    slotTemp.age = session.min_age_limit;
                    slotTemp.vaccine = session.vaccine;
                    slotTemp.noOfSlots = availableCapacity;
                })
                if (isHaveValidSession)
                    slots.push(slotTemp);
            })
            setSlots(slots);
        })();

    }, [selectedDistrictId, pincode, underFortyFive, aboveFortyFive, isCovisheild, isCovaxin, isFree, isPaid, date, hospitalName, isSputnikV])

    return (
        <Container>
            <List>
                {loading &&
                <LoadingView number={3}/>
                }
                {slots.length <= 0 &&
                <EmptyListView/>
                }
                {slots.map((value, index) => {
                    let noOfSlots = value.noOfSlots;
                    let isHaveNoSlot = noOfSlots <= 0;
                    return <Paper elevation={7}
                                  style={{margin: theme.spacing(2, 0, 2, 0), borderRadius: theme.spacing(1)}}
                                  variant={"elevation"}>
                        <ListItem onClick={event => {

                        }} key={index} button>
                            <ListItemText primary={
                                <React.Fragment>
                                    <Typography variant={"h6"}
                                                color={"textSecondary"}>
                                        <b>
                                            {value.name}
                                        </b>
                                    </Typography>
                                    <Grid container spacing={1} direction={"row"} alignItems={"center"}>
                                        <Grid item>
                                            <LocationOnRoundedIcon fontSize={"small"}/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant={"caption"}
                                                        color={"textSecondary"}>
                                                <b>
                                                    {value.blockName}, {value.pinCode}
                                                </b>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            } secondary={
                                <React.Fragment>
                                    <Grid container spacing={1} direction={"row"}>
                                        <Grid item xs={12}>
                                            <Chip label={`${value.age}+`} variant="outlined" size="small"/>
                                        </Grid>
                                        <Typography variant={"caption"}
                                                    color={"textSecondary"}>
                                            Vaccine: <b>{value.vaccine}</b> {value.price > 0 &&
                                        <Typography variant={"caption"}
                                                    style={{color: red["A400"]}}><b>(₹{value.price})</b></Typography>}
                                        </Typography>
                                    </Grid>
                                </React.Fragment>
                            }/>
                            <ListItemSecondaryAction>
                                <React.Fragment>
                                    <Typography style={{color: !isHaveNoSlot && green["A400"]}} variant={"caption"}
                                                color={isHaveNoSlot ? "textSecondary" : "initial"}>
                                        <b>
                                            {isHaveNoSlot ? "No Slots" : `${noOfSlots} Slots`}
                                        </b>
                                    </Typography>
                                </React.Fragment>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {!isHaveNoSlot &&
                        <Button style={{backgroundColor: green["A400"]}} variant={"contained"} fullWidth>
                            <a target="_blank" href="https://selfregistration.cowin.gov.in/">
                                Book on CoWin
                            </a>
                        </Button>}
                    </Paper>
                })}
            </List>
        </Container>
    )
}
