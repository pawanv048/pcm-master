import React from 'react';
import { Text, Alert, View, FlatList, Platform } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, ColButton, TitleBar, ListItem, showErrorToast, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import Api, { shareProgramUrl, googleDownloadLink, appleDownloadLink } from '../api/api'
import moment from 'moment'

class ScheduledPrograms extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        models: [],
        today: moment().format('ddd'),
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
                    title={Strings.t99}
                    titlePos='flex-start' />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <View style={[{ marginTop: 0 }]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                horizontal={false}
                                data={this.state.models}
                                extraData={this.state} // refresh list on state change
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={this.showHeader}
                                renderItem={this._renderItem} />
                        </View>
                        {!this.state.loading && this.state.models.length == 0 ?
                            this.showNotFound()
                            :
                            null
                        }

                    </Col>
                </Body>
            </Screen>
        );
    }

    showNotFound = () => {
        return (
            <Col center extraStyle={[{ height: 50 }]}>
                <Text style={[stylesC.textM16]}>
                    {Strings.t149}
                </Text>
            </Col>
        )
    };

    showHeader = () => {
        return (
            <Col extraStyle={[{ margin: 10 }]}>
                <Text style={[stylesC.textD14]}>
                    {Strings.t164}
                </Text>
            </Col>
        )
    };

    _renderItem = ({ item, index }) => { // item > group of programs
        let program = item.program
        return (
            <ListItem
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2', paddingHorizontal: 10 }]}
                activeOpacity={1}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 15, backgroundColor: 'transparent' }]}
                onPress={() => {
                    // Utils.moveToScreen(this.props.navigation, 'HomeStack', 'MyProgramDetails')
                }}>
                <Center extraStyle={[{}]}>
                    <Text style={stylesC.textD16}>
                        {program.title}
                    </Text>

                    <Text style={[stylesC.textM14, { color: Colors.theme }]}>
                        {this.state.today}
                    </Text>

                    <Text style={stylesC.textM14}>
                        {Strings.t152}: {program.exercises}
                    </Text>

                    {/* <Text style={[stylesC.textM14, { color: Colors.orange }]}>
                        In Progress
                    </Text> */}
                    <Row spaceBetween extraStyle={[{ marginTop: 5 }]}>
                        <Button
                            label={Strings.t100}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button30, { flex: 1, marginRight: 5, marginHorizontal: 0, backgroundColor: Colors.theme }]}
                            labelStyle={[stylesC.buttonT14]}
                            onPress={() => {
                                this.viewProgram(program)
                            }} />
                        <Button
                            label={Strings.t165}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button30, { flex: 1, marginRight: 5, marginHorizontal: 0, backgroundColor: Colors.themeDark }]}
                            labelStyle={[stylesC.buttonT14]}
                            onPress={() => {
                                this.shareProgram(program)
                            }} />
                        {program.user_id + '' === this.props.user.id + '' ?
                            <Button
                                label={Strings.t154}
                                activeOpacity={0.6}
                                buttonStyle={[stylesC.button30, { flex: 1, marginRight: 5, marginHorizontal: 0, backgroundColor: Colors.orange }]}
                                labelStyle={[stylesC.buttonT14]}
                                onPress={() => {
                                    this.editProgram(program)
                                    // if (!isWeekly) {
                                    //     this.editProgram(program)
                                    // }
                                    // else {
                                    //     this.editWeeklyProgram(item.programs)
                                    // }
                                }} />
                            :
                            null
                        }
                        <Button
                            label={Strings.t136}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.button30, { flex: 1, marginTop: 0, marginHorizontal: 0, backgroundColor: Colors.red }]}
                            labelStyle={[stylesC.buttonT14]}
                            onPress={() => {
                                this.deleteProgram(program)
                                // if (!isWeekly) {
                                //     this.deleteProgram(program)
                                // }
                                // else {
                                //     this.deleteWeeklyProgram(item.programs[0].program)
                                // }
                            }} />
                    </Row>
                </Center>
            </ListItem>
        )
    }

    viewProgram = (program) => {
        this.props.navigation.navigate('MyProgramDetails', { master_id: program.master_id, weekday: this.state.today });
    };

    // viewWeeklyProgram = (program) => {
    //     this.props.navigation.navigate('MyProgramDetails', { master_id: program.master_id });
    // };

    editProgram = (program) => {
        this.props.navigation.navigate('AddProgram', { program: program });
    };

    editWeeklyProgram = (programs) => {
        // sort grouped programs day wise
        let arr = this.sortPrograms(programs)
        this.props.navigation.navigate('AddWeeklyProgram', { programs: arr });
    };

    sortPrograms = (programs) => {
        let arr = []
        for (let i = 0; i < programs.length; i++) {
            const p = programs[i];
            if (p.program.weekday === 'Sun') {
                arr[0] = p
            }
            else if (p.program.weekday === 'Mon') {
                arr[1] = p
            }
            else if (p.program.weekday === 'Tue') {
                arr[2] = p
            }
            else if (p.program.weekday === 'Wed') {
                arr[3] = p
            }
            else if (p.program.weekday === 'Thu') {
                arr[4] = p
            }
            else if (p.program.weekday === 'Fri') {
                arr[5] = p
            }
            else if (p.program.weekday === 'Sat') {
                arr[6] = p
            }
        }
        return arr;
    };

    shareProgram = (program) => {
        let downloadLink = Platform.OS === 'android' ? googleDownloadLink : appleDownloadLink
        const sharelink = shareProgramUrl + '/' + program.master_id
        let body = Strings.t139+' >> ' + program.title + ': ' + sharelink + Strings.t140 + downloadLink + Strings.t141
        Utils.onShare(program.title, body)
    };

    deleteProgram = (program) => {
        console.log('delete: ' + JSON.stringify(program));
        Alert.alert( // react-native
            Strings.t144,
            Strings.t145,
            [
                { text:  Strings.t91, onPress: () => console.log('Cancel Pressed'), style: 'cancel' }, // negative
                {
                    text:  Strings.t136, onPress: () => {
                        const master_id = program.master_id
                        const user_id = program.user_id
                        // remove from list
                        this.setState(state => {
                            const models = state.models.filter((item_, j) => {
                                return item_.programs[j].program.master_id !== master_id; //false will delete
                            });
                            return { models: models };
                        });

                        if (user_id === this.props.user.id) {
                            // delete
                            Api.deleteProgram(master_id,
                                (response) => {
                                    this.setState({ loading: false })
                                },
                                (error) => {
                                    this.setState({ loading: false });
                                    showErrorToast('' + error);
                                });
                        }
                        else {
                            // unjoin
                            Api.joinFriendProgram(master_id, this.props.user.id, '0',
                                (response) => {
                                    this.setState({ loading: false })
                                },
                                (error) => {
                                    this.setState({ loading: false });
                                    showErrorToast('' + error);
                                });
                        }
                    }
                }, // positive
            ],
            {
                cancelable: true
            }
        );
    };

    async componentDidMount() {
        console.log('componentDidMount');
    }

    onFocus = () => {
        console.log('onFocus');
        const joinedPrograms = this.props.navigation.getParam('joinedPrograms');
        const today = moment().format('ddd')
        console.log('today: ' + today);
        let arr = []
        for (let i = 0; i < joinedPrograms.length; i++) {
            const p = joinedPrograms[i];
            // console.log('joined: '+JSON.stringify(p.programs));
            if (p.program.weekday === today) {
                arr = arr.concat(p)
            }
        }
        if (arr.length == 1) {
            // auto move to details
            this.viewProgram(arr[0].program)
        }
        else {
            this.setState({ models: arr })
        }
        // this.loadData()
    };

}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user,
    }
}
export default connect(mapStateToProps, {})(ScheduledPrograms)