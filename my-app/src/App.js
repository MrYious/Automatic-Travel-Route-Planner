import { v4 as uuid } from "uuid"
import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import {
  Box,
  Toolbar, 
} from "@material-ui/core"
import Header from "components/Header"
import { libraries } from "config"
import { getValidLocations } from "utils";
import Map from "components/Map";
import Panel from "components/Panel";

// eslint-disable-next-line
const activated = "AIzaSyDPCx-DR57YVb-1pYfEwi9EsvWUqLWMKmA"
// eslint-disable-next-line
const dummy = "AIzaSyDr-Sb2ICpI-9HRANMJBLIOEAzAHNNWjbk"

export default function App() {
  const [locations, setLocations] = useState([{ id: uuid() }, { id: uuid() } ])
  const [fetchDistance, setFetchDistance] = useState(false)
  const [matrix, setMatrix] = useState(null)
  const [route, setRoute] = useState(null)

  const validLocations = getValidLocations(locations)
  
  useEffect(_ => {
    if (!matrix) return
    if (validLocations.length < 2) return
    
    const newRoute = validLocations // insert algorithm

    setRoute(newRoute)
    // eslint-disable-next-line
  }, [matrix])

  
  const handleGenerateRoute = () => {
    setLocations(validLocations)
    setFetchDistance(true)
  } 

  return <div style={{ height: "100%", display: "flex", flexDirection: "column"}}>
    <Header />
    <Toolbar/>
    <Box display="flex" height="100%">
      <LoadScript
        googleMapsApiKey={activated}
        libraries={libraries}
      >
        <Panel 
          {...{ locations, setLocations, setRoute, handleGenerateRoute }}
        />
        <Map 
          mapContainerStyle={{ flexGrow: 1 }}
          {...{ locations, matrix, setMatrix, route, fetchDistance, setFetchDistance }}
        />
      </LoadScript>
    </Box>
  </div>
}