import React from 'react';
import Grid from '@material-ui/core/Grid';
import AppToolbar from '../components/AppToolbar.jsx';
import Reports from '../components/Reports.jsx';
import ReportsMap from '../components/ReportsMap.jsx';
import Dashboard from './Dashboard.jsx';

class ReportPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Reports : [{
                ReportID : null,
                DateTime: null,
                Location : null,
                Longitude: null,
                Latitude : null,
                Triangulated: null,
                TriangulateID: null
            }]
        }
    }

    componentDidMount() {
        this.getReports();
    }

    getReports = async() => {
        await fetch('/api/reports')
        .then(async(res) => res.json())
        .then(res => this.setState({Reports : res.ReportsData}))
    }

    render(){
        return(
            <div>
                <AppToolbar />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={7}>
                        <Reports Reports={this.state.Reports} refresh={() => this.getReports}/>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <ReportsMap Reports={this.state.Reports}/>
                    </Grid>
                </Grid>
                <Dashboard />
            </div>
        )
    }
}

export default ReportPage;