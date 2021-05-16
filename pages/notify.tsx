import React, {useEffect, useState} from "react";
import {
    AppBar,
    Button,
    Container,
    createStyles,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Paper,
    Snackbar,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import {useRouter} from "next/router";
import {useUser} from "../lib/hooks";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../src/theme";
import CloseIcon from '@material-ui/icons/Close';
import DistrictWiseForm from "../components/DistrictWiseForm";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import localforage from "localforage";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

type DistrictItem = {
    id: string,
    name: string,
}

export default function Notify() {
    let router = useRouter();
    let user = useUser();

    const [errorMsg, setErrorMsg] = useState("");
    const [message, setMessage] = useState("");

    const [selectedStateId, setSelectedStateId] = useState("");
    const [selectedDistrictId, setSelectedDistrictId] = useState("");
    const [selectedDistrictName, setSelectedDistrictName] = useState("");

    const [districts, setDistricts] = useState<DistrictItem[]>([]);
    const [notificationStatus, setNotificationStatus] = useState("granted");

    const enableNotification = async () => {
        try {
            if (Notification.permission !== 'granted') {
                await Notification.requestPermission();
                setNotificationStatus(Notification.permission)
            } else
                setNotificationStatus(Notification.permission)
        } catch (e) {
            console.log(e.message)
        }
    }


    useEffect(() => {
        enableNotification();
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const districts = await localforage.getItem<DistrictItem[]>('districts');
                if (!districts) return;
                setDistricts(districts)
            } catch (e) {
                console.log(e.message)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const districtsRes = await localforage.setItem<DistrictItem[]>('districts', districts);
            } catch (e) {
                console.log(e.message)
            }
        })()
    }, [districts])


    let classes = useStyles();

    function handleClose() {
        if (errorMsg) setErrorMsg("")
        else setMessage("");
    }


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const removeDistrict = (id) => {
        setDistricts(districts.filter(value => value.id !== id))
    }

    const addDistrict = () => {
        if (districts.filter(value => value.id === selectedDistrictId).length > 0) return setErrorMsg("Item is already added");
        setDistricts(prevState => [...prevState, {
            id: selectedDistrictId,
            name: selectedDistrictName
        }])
        setSelectedStateId("")
        setSelectedDistrictId("")
        setSelectedDistrictName("")
        handleCloseDialog();
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar elevation={7} position="static">
                <Toolbar>
                    <IconButton onClick={event => router.back()}>
                        <ArrowBackRoundedIcon fontSize={"small"}/>
                    </IconButton>
                    <Typography color={"secondary"} variant="h6" className={classes.title}>
                        Notify Me
                    </Typography>
                </Toolbar>
            </AppBar>
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
                {notificationStatus === "default" &&
                <Container>
                    <Typography variant={"caption"} color={"error"}>
                        <>Please enable notification, to show you the latest updates on slots</>
                    </Typography>
                    <Button style={{marginTop: theme.spacing(1)}} fullWidth variant="contained" color={"secondary"}
                            onClick={event => enableNotification()}>
                        Enable Notification
                    </Button>
                </Container>
                }
                {notificationStatus === "denied" &&
                <Container>
                    <Typography variant={"caption"} color={"error"}>
                        <>Notification is block, please enable notification, to show you the latest updates on
                            slots
                        </>
                    </Typography>
                </Container>
                }
                <>
                    <Typography style={{marginTop: theme.spacing(2)}} variant={"h6"} color={"textSecondary"}>
                        <b>Preferred Districts</b>
                    </Typography>
                    <List>
                        {districts.map((value, index) => {
                            return <Paper variant={"outlined"} style={{margin: theme.spacing(1, 0, 1, 0)}}>
                                <ListItem key={index}>
                                    <ListItemText primary={
                                        <React.Fragment>
                                            <Typography variant={"h6"}>
                                                {value.name}
                                            </Typography>
                                        </React.Fragment>
                                    }/>
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={event => removeDistrict(value.id)}>
                                            <CloseRoundedIcon fontSize={"small"} color={"error"}/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Paper>
                        })}
                    </List>

                    {districts.length < 1 &&
                    <Button fullWidth variant="text" color="primary" onClick={handleClickOpen}>
                        <AddRoundedIcon/> Add new District
                    </Button>
                    }
                    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Add new District</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to real time updates, first select the preferred District
                            </DialogContentText>
                            <DistrictWiseForm setSelectedDistrictName={setSelectedDistrictName}
                                              setSelectedDistrictId={setSelectedDistrictId}
                                              selectedStateId={selectedStateId}
                                              setSelectedStateId={setSelectedStateId}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={addDistrict} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            </Container>
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
