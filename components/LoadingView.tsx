import {Skeleton} from "@material-ui/lab";
import React from "react";

export default function LoadingView({number}) {
    let arr = new Array(number)
    arr.fill(0);
    return (
        <>
            {arr.map(value => <Skeleton height={40} variant="text"/>)}
        </>
    )
}
