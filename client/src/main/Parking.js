import Parking_Show from '../components/Parking_Show';
import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import ParkingAdd from '../components/ParkingAdd';
import Parking_Park_out from '../components/Parking_Park_out';


const styles = theme => ({
  root : {
    width : '92%',
    flexGrow: 1,
    minWidth : 1080
  },
  menu : {
    width : '8%',
    marginTop : 15,
    marginBottom : 15,
    display : 'flex',
    justifyContent : 'center'
  },
  paper : {
    marginLeft : 18,
    marginRight : 18
  },
  progress : {
    margin : theme.spacing(2)
  },
  tableHead : {
    fontSize : '1.0rem'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },

});

class Parking extends Component{

  constructor(props){
    super(props);
    this.state = {
        parkings : '',
      completed : 0,
      searchKeyword : ''
    }
  }

  stateRefresh = () => {
    this.setState({
        parkings : '',
      completed : 0,
      searchKeyword : ''
    });
    this.callApi()
      .then(res => this.setState({parkings : res}))
      .catch(err => console.log(err));
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then(res => this.setState({parkings : res}))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/parkings');
    const body = await response.json();
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({completed : completed >= 100 ? 0 : completed + 1});
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render(){
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.car_number.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <Parking_Show stateRefresh={this.stateRefresh} key={c.car_number} car_number={c.car_number} staff_id={c.staff_id} guest_mail={c.guest_mail}
        car_model={c.car_model} park_in={c.park_in} park_out={c.park_out} />
      });
    }
    const { classes } = this.props;
    const cellList = ["차량 번호", "담당직원", "소유주", "차량 모델", "파크인", "파크아웃", "설정"];
    return (
        <Card>
        <div className={classes.root}>
          <AppBar position="static" color="s">
            <Toolbar>
              <Typography className={classes.title} variant="h6" noWrap>
                주차 목록
              </Typography>
              <div className={classes.menu}>
                <Parking_Park_out stateRefresh={this.stateRefresh}/>
              </div>
              <div className={classes.menu}>
                <ParkingAdd stateRefresh={this.stateRefresh}/>
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon/>
                </div>
                <InputBase
                  placeholder="주차정보 검색"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  name="searchKeyword"
                  value={this.state.searchKeyword}
                  onChange={this.handleValueChange}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
            </Toolbar>
          </AppBar>
          <Card>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {cellList.map(c => {
                    return <TableCell className={classes.tableHead}>{c}</TableCell>
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                { this.state.parkings ? 
                filteredComponents(this.state.parkings) :  
                <TableRow>
                  <TableCell colSpan="12" align="center">
                    <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                  </TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </Card>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(Parking);