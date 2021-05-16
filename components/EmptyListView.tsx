import React from "react";
import {Container, Typography} from "@material-ui/core";
import EventBusyTwoToneIcon from '@material-ui/icons/EventBusyTwoTone';
import Grid from "@material-ui/core/Grid";
import theme from "../src/theme";

export default function EmptyListView() {

    return (
        <Container style={{marginTop: theme.spacing(2)}}>
            <Grid container direction={"column"} justify={"center"} alignItems={"center"} spacing={1}>
                <Grid item xs={12}><EventBusyTwoToneIcon fontSize={"large"} color={"disabled"}/></Grid>
                <Grid item xs={12}><Typography variant={"h6"} color={"textSecondary"}>No slots
                    available </Typography></Grid>
            </Grid>
        </Container>
    )
}
