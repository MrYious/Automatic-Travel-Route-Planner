import { v4 as uuid } from "uuid"
import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import {
  Box,
  IconButton,
  Snackbar,
} from "@material-ui/core"
import {
  Clear as ClearIcon,
} from "@material-ui/icons"
import { Alert } from "@material-ui/lab"
import { libraries } from "config"
import { getValidLocations } from "utils";
import Map from "components/Map";
import Panel from "components/Panel";
import * as tsp from "tsp/index"

// eslint-disable-next-line
const activated = "AIzaSyDPCx-DR57YVb-1pYfEwi9EsvWUqLWMKmA"
// eslint-disable-next-line
const dummy = "AIzaSyDr-Sb2ICpI-9HRANMJBLIOEAzAHNNWjbk"

export default function App() {
  const [locations, setLocations] = useState([{ id: uuid() }, { id: uuid() } ])
  const [fetchDistance, setFetchDistance] = useState(false)
  const [matrix, setMatrix] = useState(null)
  const [end, setEnd] = useState("ANY")
  const [route, setRoute] = useState(null)
  // const [error, setError] = useState("")
  const [notification, setNotification] = useState({ text: "", severity: "info" })
  const [noStart, setNoStart] = useState(false)
  const [noEnd, setNoEnd] = useState(false)

  const validLocations = getValidLocations(locations)
  
  useEffect(_ => {
    if (!matrix) return
    if (validLocations.length < 2) return

    const endIndex = validLocations.findIndex(loc => loc.id === end)
    setRoute(tsp.getRoute(matrix, endIndex).path)
    // eslint-disable-next-line
  }, [matrix])

  const handleAddLocation = (newLoc = {}) => {
    const emptyLoc = locations.find(loc => !loc.value)
    
    if (locations.length >= 10 && !emptyLoc) return setNotification({ text: "You can only have up to 10 locations.", severity: "warning" })

    if (emptyLoc) 
      setLocations(old => old.map(loc => 
        loc.id === emptyLoc.id ? { id: loc.id, ...newLoc }
        : loc
      ))
    else
      setLocations(old => [...old, { ...newLoc, id: uuid() }])
    setRoute(null)
  }
  
  const handleGenerateRoute = () => {
    const newNoStart = !locations?.[0].value
    const newNoEnd = !end
    
    setNoStart(newNoStart)
    setNoEnd(newNoEnd)

    if (newNoStart || newNoEnd) return

    setRoute(null)
    setLocations(validLocations)
    setFetchDistance(true)
  } 

  return <div style={{ height: "100%", display: "flex", flexDirection: "column"}}>
    <Box display="flex" height="100%">
      <LoadScript
        googleMapsApiKey={activated}
        libraries={libraries}
      >
        <Panel 
          {...{ handleAddLocation, noStart, setNoStart, noEnd, setNoEnd, end, setEnd, locations, setLocations, route, setRoute, handleGenerateRoute, matrix }}
        />
        <Map 
          mapContainerStyle={{ flexGrow: 1 }}
          {...{ handleAddLocation, setNotification, locations, matrix, setMatrix, route, fetchDistance, setFetchDistance }}
        />
      </LoadScript>
    </Box>
    <Snackbar 
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(notification.text)}
    >
      <Alert severity={notification.severity}>
        {notification.text}
        <IconButton size="small" onClick={_ => setNotification({ text: "", severity: " info" })}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Alert>
    </Snackbar>
  </div>
}