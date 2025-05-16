import {createBrowserRouter} from "react-router";
import SelectColors from "../screens/SelectColors";
import Result from "../screens/Result";

const appRouter = createBrowserRouter(
    [
        {
            path: "/select",
            Component: SelectColors,
        },
        {
            path: "/result",
            Component: Result,
        }
    ]
)
export default appRouter;