import React, {useState} from "react";
import {Button, Container, Grid, IconButton, Paper, Snackbar, Typography} from "@material-ui/core";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../src/theme";
import CloseIcon from '@material-ui/icons/Close';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DistrictWiseForm from "../components/DistrictWiseForm";
import PincodeWiseForm from "../components/PincodeWiseForm";
import SlotsList from "../components/SlotsList";
import FilterForm from "../components/FilterForm";
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import {useRouter} from "next/router";
import blue from "@material-ui/core/colors/blue";

export default function Home() {

    let router = useRouter();

    const [errorMsg, setErrorMsg] = useState("");
    const [message, setMessage] = useState("");
    const [sortBy, setSortBy] = useState("district");

    const [pincode, setPincode] = useState("");
    const [selectedStateId, setSelectedStateId] = useState("");
    const [selectedDistrictId, setSelectedDistrictId] = useState("");
    const [selectedDistrictName, setSelectedDistrictName] = useState("");

    //filters
    const [underFortyFive, setUnderFortyFive] = useState(false);
    const [aboveFortyFive, setAboveFortyFive] = useState(false);
    const [isCovisheild, setCovishield] = useState(false);
    const [isCovaxin, setCovaxin] = useState(false);
    const [isSputnikV, setSputnikV] = useState(false);
    const [isFree, setFree] = useState(false);
    const [isPaid, setPaid] = useState(false);


    function handleClose() {
        if (errorMsg) setErrorMsg("")
        else setMessage("");
    }

    function handleBtn(value) {
        setSortBy(value);
        setPincode("")
        setSelectedDistrictId("")
        setSelectedStateId("")
        setSelectedDistrictName("")
    }

    return (
        <ThemeProvider theme={theme}>
            <Container style={{marginTop: theme.spacing(5)}}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={(errorMsg !== "" || message !== "")}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message={errorMsg || message}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit"
                                        onClick={handleClose}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <Grid container spacing={4} direction={"column"}
                      justify={"center"} alignItems={"center"}>
                    <Grid item xs={12}>
                        <img src="/images/banner-logo.png" alt="SpotMyVaccine Logo"/>
                    </Grid>
                    <Typography variant={"caption"} align={"center"}>
                        Search for vaccination slots, Get notified when available on your device
                    </Typography>
                    <Grid item xs={12}>
                        <ButtonGroup color="secondary" aria-label="outlined primary button group">
                            <Button onClick={event => handleBtn("district")}
                                    variant={sortBy === "district" ? "contained" : "outlined"}>District</Button>
                            <Button onClick={event => handleBtn("pincode")}
                                    variant={sortBy === "pincode" ? "contained" : "outlined"}>Pincode</Button>
                        </ButtonGroup>
                    </Grid>
                    {sortBy === "district"
                        ? <DistrictWiseForm setSelectedDistrictName={setSelectedDistrictName}
                                            setSelectedDistrictId={setSelectedDistrictId}
                                            selectedStateId={selectedStateId} setSelectedStateId={setSelectedStateId}/>
                        :
                        <PincodeWiseForm selectedPincode={pincode} setSelectedPincode={setPincode}/>
                    }
                    {selectedDistrictId &&
                    <FilterForm
                        isSputnikV={isSputnikV} setSputnikV={setSputnikV}
                        underFortyFive={underFortyFive} setUnderFortyFive={setUnderFortyFive}
                        aboveFortyFive={aboveFortyFive} setAboveFortyFive={setAboveFortyFive}
                        isCovisheild={isCovisheild} setCovishield={setCovishield}
                        isCovaxin={isCovaxin} setCovaxin={setCovaxin}
                        isFree={isFree} setFree={setFree}
                        isPaid={isPaid} setPaid={setPaid}
                    />
                    }
                    <Paper elevation={0} style={{margin: theme.spacing(2)}}
                           onClick={event => router.push(`/notify`)}>
                        <Button variant={"contained"} style={{color: "white", backgroundColor: blue["A400"]}}
                                size={"small"}
                                startIcon={<NotificationsRoundedIcon/>}>
                            Notify me when a slot opens up
                        </Button>
                    </Paper>
                    <SlotsList underFortyFive={underFortyFive}
                               isSputnikV={isSputnikV}
                               aboveFortyFive={aboveFortyFive}
                               isCovisheild={isCovisheild}
                               isCovaxin={isCovaxin}
                               isFree={isFree}
                               isPaid={isPaid} pincode={pincode} selectedDistrictName={selectedDistrictName}
                               selectedDistrictId={selectedDistrictId}/>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}
