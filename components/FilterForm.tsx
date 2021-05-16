import React from "react";
import {Button, Grid} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import theme from "../src/theme";

export default function FilterForm({underFortyFive, aboveFortyFive, isCovisheild, isCovaxin, isFree, isPaid, setUnderFortyFive, setAboveFortyFive, setCovishield, setCovaxin, setFree, setPaid}) {

    function handleFilterButtonClick(setter, value) {
        setter(!value)
    }

    return (
        <Container style={{marginTop: theme.spacing(1)}}>
            <Typography variant={"h6"}><b>Filters</b></Typography>
            <Grid style={{marginTop: theme.spacing(1)}} spacing={1} container direction={"row"}>
                <Grid item>
                    <Button onClick={event => handleFilterButtonClick(setUnderFortyFive, underFortyFive)}
                            color={underFortyFive ? "primary" : "default"}
                            variant={"outlined"}>
                        18-45
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={event => handleFilterButtonClick(setAboveFortyFive, aboveFortyFive)}
                            color={aboveFortyFive ? "primary" : "default"}
                            variant={"outlined"}>
                        45+
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={event => handleFilterButtonClick(setCovishield, isCovisheild)}
                            color={isCovisheild ? "primary" : "default"}
                            variant={"outlined"}>
                        COVISHIELD
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={event => handleFilterButtonClick(setCovaxin, isCovaxin)}
                            color={isCovaxin ? "primary" : "default"}
                            variant={"outlined"}>
                        COVAXIN
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={event => handleFilterButtonClick(setFree, isFree)}
                            color={isFree ? "primary" : "default"}
                            variant={"outlined"}>
                        Free
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={event => handleFilterButtonClick(setPaid, isPaid)}
                            color={isPaid ? "primary" : "default"}
                            variant={"outlined"}>
                        Paid
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}


