import {RouterProvider} from "react-router/dom";
import appRouter from "./navigate/app.router.tsx";
import {useEffect} from "react";
import {urls} from "./navigate/urls.ts";

const App = () => {
    useEffect(() => {
        if (location.pathname==='/'){
            location.replace(urls.selectColor)
        }
    })
    return (
        <RouterProvider router={appRouter}/>
    );
};

export default App;