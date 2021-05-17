import React, {useState} from "react";
import {
    AppBar,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Snackbar,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import {useRouter} from "next/router";
import {useUser} from "../../lib/hooks";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../../src/theme";
import CloseIcon from '@material-ui/icons/Close';
import FilterForm from "../../components/FilterForm";
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import SlotsByDayWiseList from "../../components/SlotsByDayWiseList";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

import dateLib from 'date-and-time';


export default function DayWiseList() {
    let router = useRouter();
    let user = useUser();

    let {districtId, pincode, districtName, date} = router.query;
    const [errorMsg, setErrorMsg] = useState("");
    const [message, setMessage] = useState("");


    //filters
    const [underFortyFive, setUnderFortyFive] = useState(false);
    const [aboveFortyFive, setAboveFortyFive] = useState(false);
    const [isCovisheild, setCovishield] = useState(false);
    const [isCovaxin, setCovaxin] = useState(false);
    const [isSputnikV, setSputnikV] = useState(false);
    const [isFree, setFree] = useState(false);
    const [isPaid, setPaid] = useState(false);
    const [hospitalName, setHospitalName] = useState('');

    function logout() {
        router.push(`/api/logout`);
    }


    let classes = useStyles();

    function handleClose() {
        if (errorMsg) setErrorMsg("")
        else setMessage("");
    }


    return (
        <ThemeProvider theme={theme}>
            <AppBar elevation={7} position="static">
                <Toolbar>
                    <IconButton onClick={event => router.back()}>
                        <ArrowBackRoundedIcon fontSize={"small"}/>
                    </IconButton>
                    <Typography color={"secondary"} variant="h6" className={classes.title}>
                        {pincode ? `Pincode ${pincode}` : `${districtName}`} ({dateLib.format(new Date(), 'MMM DD, dddd')})
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box style={{marginTop: theme.spacing(2)}}>
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
                <Grid container>
                    <FilterForm
                        isSputnikV={isSputnikV} setSputnikV={setSputnikV}
                        underFortyFive={underFortyFive} setUnderFortyFive={setUnderFortyFive}
                        aboveFortyFive={aboveFortyFive} setAboveFortyFive={setAboveFortyFive}
                        isCovisheild={isCovisheild} setCovishield={setCovishield}
                        isCovaxin={isCovaxin} setCovaxin={setCovaxin}
                        isFree={isFree} setFree={setFree}
                        isPaid={isPaid} setPaid={setPaid}
                    />

                    <TextField value={hospitalName} onChange={event => setHospitalName(event.target.value)}
                               style={{margin: theme.spacing(2)}} fullWidth variant={"outlined"} margin={"dense"}
                               label={"Search by Hospital Name"}/>

                    <Typography style={{padding: theme.spacing(0, 2, 2, 2)}} color={"textSecondary"} variant={"caption"}
                                align={"left"}>
                        Disclaimer : While we have real-time data, slot availability on CoWin changes rapidly. If you
                        see availability, please book on CoWin instantly before the slots are lost.
                    </Typography>


                    <SlotsByDayWiseList underFortyFive={underFortyFive}
                                        isSputnikV={isSputnikV}
                                        aboveFortyFive={aboveFortyFive}
                                        isCovisheild={isCovisheild}
                                        isCovaxin={isCovaxin}
                                        isFree={isFree} date={date}
                                        isPaid={isPaid} pincode={pincode} hospitalName={hospitalName}
                                        selectedDistrictId={districtId}/>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: 250
        },
        root: {
            flexGrow: 1,
        },
        drawer: {
            paddingTop: theme.spacing(5),
            marginBottom: theme.spacing(3)
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            [theme.breakpoints.up('sm')]: {
                fontSize: '18px',
            },
        },
        large: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);

