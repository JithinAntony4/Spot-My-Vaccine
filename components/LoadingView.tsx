import {Skeleton} from "@material-ui/lab";
import React from "react";

export default function LoadingView({number}) {
    let arr = new Array(number)
    arr.fill(0);
    return (
        <>
            {arr.map((value, index) => <Skeleton key={index} height={40} variant="text"/>)}
        </>
    )
}
