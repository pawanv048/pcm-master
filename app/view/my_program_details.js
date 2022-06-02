import React from 'react';
import { Text, Image, View, Alert, Platform } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustom, ColButton, TitleBar, ListItem, Start, Center, End, showToast, showErrorToast } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Api, { shareProgramUrl, googleDownloadLink, appleDownloadLink } from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import MyStorage from '../storage/storage'
import Utils from '../util/utils.js';

class MyProgramDetails extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        weekDay: 0,
        weekDays: [
            Strings.t2, Strings.t3, Strings.t4, Strings.t5, Strings.t6, Strings.t7, Strings.t8
        ],
        programs: [], // weekly mode
        program: null, // selected
        exercises: [], // selected exercises
    }

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    render() {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    canUpdate
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t133}
                    titlePos='flex-start' />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    {this.state.programs.length > 1 ?
                        <Row spaceBetween extraStyle={[{ marginTop: 15, marginBottom: 10, marginHorizontal: 10 }]}>
                            {this.state.weekDays.map((item, index) => {
                                return this.showWeekDay(item, index)
                            })}
                        </Row>
                        :
                        null
                    }

                    {this.state.program == null ?
                        null
                        :
                        <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                            <Row spaceBetween extraStyle={[{ padding: 12 }]}>
                                <Col>
                                    <Text style={stylesC.textD16}>
                                        {this.state.program.title}
                                    </Text>
                                    {/* <Text style={stylesC.textM14}>
                                        {this.state.program.exercises} exercise(s)
                                    </Text> */}

                                    {this.state.programs.length > 1 ?
                                        <Text style={[stylesC.textM14, { color: Colors.theme }]}>
                                            {Strings.t134}
                                        </Text>
                                        :
                                        <Text style={stylesC.textM14}>
                                            {this.state.program.exercises} exercise(s)
                                        </Text>
                                    }

                                    {this.state.program.weekday == null || this.state.program.weekday === 'null' ?
                                        null
                                        :
                                        <Text style={[stylesC.textM14, { color: Colors.theme }]}>
                                            {this.state.program.weekday}
                                        </Text>
                                    }

                                </Col>
                                {/* <Col topRight>
                                    <Text style={[stylesC.textM14, { color: Colors.orange }]}>
                                        In Progress
                                    </Text>
                                </Col> */}
                            </Row>

                            <View style={[{ marginTop: 0, marginBottom: 60 }]}>
                                {this.state.exercises.map((item, index) => {
                                    return this._renderItem(item, index)
                                })}
                            </View>

                        </Col>
                    }
                </Body>
                {this.state.program == null ?
                    null
                    :
                    <Col extraStyle={[{ position: 'absolute', bottom: 0, width: '100%', padding: 15, backgroundColor: Colors.white }]}>
                        <Row spaceBetween extraStyle={[{}]}>
                            <Button
                                label={Strings.t135}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.button45, { flex: 1, marginTop: 0, marginRight: 10 }]}
                                labelStyle={[stylesC.buttonT16]}
                                onPress={() => {
                                    this.shareProgram(this.state.program)
                                }} />
                            {this.state.program.user_id + '' === this.props.user.id + '' ?
                                <Button
                                    canUpdate
                                    label={Strings.t136}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.button45, { flex: 1, marginTop: 0, marginLeft: 10, backgroundColor: Colors.red }]}
                                    labelStyle={[stylesC.buttonT16]}
                                    onPress={() => {
                                        this.deleteProgram(this.state.program)
                                    }} />
                                :
                                this.state.program.joined === '0' ?
                                    <Button
                                        canUpdate
                                        label={Strings.t137}
                                        activeOpacity={0.6}
                                        buttonStyle={[stylesC.button45, { flex: 1, marginTop: 0, marginLeft: 10, backgroundColor: Colors.red }]}
                                        labelStyle={[stylesC.buttonT16]}
                                        onPress={() => {
                                            this.joinFriendProgram(this.state.program, '1')
                                        }} />
                                    :
                                    <Button
                                        canUpdate
                                        label={Strings.t138}
                                        activeOpacity={0.6}
                                        buttonStyle={[stylesC.button45, { flex: 1, marginTop: 0, marginLeft: 10, backgroundColor: Colors.red }]}
                                        labelStyle={[stylesC.buttonT16]}
                                        onPress={() => {
                                            this.joinFriendProgram(this.state.program, '0')
                                        }} />
                            }
                        </Row>
                    </Col>
                }

            </Screen>
        );
    }

    showWeekDay = (item, index) => {
        return (
            <Button
                key={index.toString()}
                canUpdate
                label={item}
                activeOpacity={0.6}
                buttonStyle={[stylesC.button30, { width: 45, backgroundColor: index == this.state.weekDay ? Colors.theme : Colors.gray }]}
                labelStyle={[stylesC.buttonT14]}
                onPress={() => {
                    if (this.state.loading)
                        return
                    this.setState({ weekDay: index })
                    if (this.state.programs.length > 0) {
                        setTimeout(() => {
                            if (this.checkWeekdayExists(index)) {
                                // this.loadProgram(this.state.programs)
                                const program = this.getCurrentProgram(this.state.programs, index)
                                console.log('program:' + JSON.stringify(program));
                                this.setState({ program: program, exercises: program == null ? [] : program.program_exercises })
                            }
                            else {
                                console.log('do nothing')
                                this.setState({ program: null, exercises: [] })
                            }
                        }, 50);
                    }
                }} />
        )
    };

    checkWeekdayExists = (index) => {
        let weekdayName = this.state.weekDays[index]
        for (let i = 0; i < this.state.programs.length; i++) {
            const program = this.state.programs[i];
            if (program.weekday === weekdayName) {
                return true
            }
        }
        return false
    };

    sortPrograms = (programs) => {
        // sort grouped programs day wise
        let arr = []
        for (let i = 0; i < programs.length; i++) {
            const program = programs[i];
            if (program.weekday === 'Sun') {
                arr[0] = program
                programs[i].weekdayIndex = 0
            }
            else if (program.weekday === 'Mon') {
                arr[1] = program
                programs[i].weekdayIndex = 1
            }
            else if (program.weekday === 'Tue') {
                arr[2] = program
                programs[i].weekdayIndex = 2
            }
            else if (program.weekday === 'Wed') {
                arr[3] = program
                programs[i].weekdayIndex = 3
            }
            else if (program.weekday === 'Thu') {
                arr[4] = program
                programs[i].weekdayIndex = 4
            }
            else if (program.weekday === 'Fri') {
                arr[5] = program
                programs[i].weekdayIndex = 5
            }
            else if (program.weekday === 'Sat') {
                arr[6] = program
                programs[i].weekdayIndex = 6
            }
            else {
                arr[0] = program
                programs[i].weekdayIndex = 0
            }
        }
        // sort by weekday index
        let sorted = programs.sort((a, b) => a.weekdayIndex > b.weekdayIndex ? 1 : -1)
        return sorted;
    };

    shareProgram = (program) => {
        let downloadLink = Platform.OS === 'android' ? googleDownloadLink : appleDownloadLink
        const sharelink = shareProgramUrl + '?program=' + program.master_id
        let body = Strings.t139+' >> ' + program.title + ': ' + sharelink + Strings.t140 + downloadLink + Strings.t141
        Utils.onShare(this.props.user.fname + ' '+Strings.t142, body)
    };

    joinFriendProgram = (program, join) => {
        const master_id = program.master_id
        const user_id = program.user_id
        this.setState({ loading: true })
        Api.joinFriendProgram(master_id, this.props.user.id, join,
            (response) => {
                this.setState({ loading: false })
                showToast(Strings.t143)
                this.props.navigation.goBack()
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

    deleteProgram = (program) => {
        Alert.alert( // react-native
            Strings.t144,
            Strings.t145,
            [
                { text: Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text: Strings.t136, onPress: () => {
                        const master_id = program.master_id
                        const user_id = program.user_id
                        this.setState({ loading: true })
                        Api.deleteProgram(master_id,
                            (response) => {
                                this.setState({ loading: false })
                                this.props.navigation.goBack()
                            },
                            (error) => {
                                this.setState({ loading: false });
                                showErrorToast('' + error);
                            });
                    }
                }, // positive
            ],
            {
                cancelable: true
            }
        );

    };

    _renderItem = (item, index) => {
        console.log('title: ' + item.title);
        if (item.video == null) {
            return <Text style={[stylesC.textD14]}>
                null
            </Text>
        }
        let doneSets = this.getSets(item)
        return (
            <ListItem
                key={index.toString()}
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={0.6}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    this.props.navigation.navigate('PlayVideo', { video: item.video });
                }}>
                <Start>
                    <Image
                        resizeMode='contain'
                        style={{ width: 150, height: 100, borderWidth: 1, borderColor: 'lightgray', borderRadius: 5 }}
                        source={{ uri: this.props.fileUrls.LibraryImages + item.video.thumbnail }} />
                    <Col center extraStyle={[{ position: 'absolute', width: 150, height: 100 }]}>
                        <IconCustom
                            conatinerStyle={[stylesC.center, { backgroundColor: Colors.theme, borderRadius: 20, width: 35, height: 35 }]}
                            imageStyle={[stylesC.imageM24, { tintColor: 'white' }]}
                            resizeMode='contain'
                            source={require('../assets/play.png')} />
                    </Col>
                </Start>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textD16}>
                        {item.title}
                    </Text>
                    <Text style={stylesC.textM14}>
                        {Strings.t146}: {doneSets}/{item.sets}
                    </Text>
                    {doneSets < parseInt(item.sets.toString()) ?
                        <Button
                            canUpdate
                            label={Strings.t147}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button30, { width: 120, marginTop: 5, marginHorizontal: 0 }]}
                            labelStyle={[stylesC.buttonT14]}
                            onPress={() => {
                                this.updateSets(item)
                            }} />
                        :
                        <Button
                            canUpdate
                            label={Strings.t148}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button30, { width: 120, marginTop: 5, marginHorizontal: 0 }]}
                            labelStyle={[stylesC.buttonT14]}
                            onPress={() => {
                                this.reset(item)
                            }} />
                    }
                </Center>
                <End>

                </End>
            </ListItem>
        )
    }

    reset = (item) => {
        MyStorage.updateSets(this.state.program.id, item.id, 0)
        this.setState({ loading: false }) // refresh
    };

    updateSets = (item) => {
        MyStorage.updateSets(this.state.program.id, item.id, this.getSets(item) + 1)
        this.setState({ loading: false }) // refresh
    };

    getSets = (item) => {
        // return '0'
        const sets = MyStorage.getSets(this.state.program.id, item.id)
        console.log('sets: ' + sets);
        if (sets)
            return parseInt(sets + '')
        return 0
    };

    async componentDidMount() {
        console.log('componentDidMount');
        const master_id = this.props.navigation.getParam('master_id');
        const weekday = this.props.navigation.getParam('weekday');
        console.log('weekday: ' + weekday);
        if (weekday) {
            for (let i = 0; i < this.state.weekDays.length; i++) {
                const day = this.state.weekDays[i];
                if (day === weekday) {
                    console.log('set weekday: ' + i);
                    this.setState({ weekDay: i, })
                    break
                }
            }
        }
        if (master_id) {
            this.loadProgram(master_id)
        }
    }

    onFocus = () => {
        console.log('onFocus');
    };

    getCurrentProgram = (programs, weekDay) => {
        let weekdayName = this.state.weekDays[weekDay]
        for (let i = 0; i < programs.length; i++) {
            const program = programs[i];
            if (program.weekday === weekdayName) {
                return program
            }
        }
        return null
    };

    getInitialProgramIndex = (programs) => {
        console.log('weekday: ' + programs[0].weekday);
        for (let i = 0; i < this.state.weekDays.length; i++) {
            const weekday = this.state.weekDays[i];
            if (weekday === programs[0].weekday) {
                if(this.state.weekDay > i){
                    i = this.state.weekDay
                }
                return i
            }
        }
        return 0
    };

    getInitialProgram = (programs) => {
        // return programs[0]
        let index = this.getInitialProgramIndex(programs)
        let weekdayName = this.state.weekDays[index]
        for (let i = 0; i < programs.length; i++) {
            const program = programs[i];
            if (program.weekday === weekdayName) {
                return program
            }
        }
        return null
    };

    loadProgram = (master_id) => {
        this.setState({ loading: true });
        Api.getProgramDetails(this.props.user.id, master_id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    if (response.data.length > 0) {
                        // sorting just for weekdays order
                        const programs = this.sortPrograms(response.data)
                        // console.log('SORTED: ' + JSON.stringify(sorted));
                        // let programs = response.data
                        if (programs.length > 1) { // weekly program
                            this.setState({ programs: programs, weekDay: this.getInitialProgramIndex(programs), program: this.getInitialProgram(programs), exercises: this.getInitialProgram(programs).program_exercises })
                        }
                        else {
                            this.setState({ programs: programs, program: programs[0], exercises: programs[0].program_exercises })
                        }
                    }
                }
                else {
                    showErrorToast(response.msg)
                }
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
        fileUrls: state.FileUrlsReducer.fileUrls,
    }
}
export default connect(mapStateToProps, {})(MyProgramDetails)