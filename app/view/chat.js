import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Input } from 'react-native-elements';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import { stylesC } from '../styles/style_common.js';
import { Screen, TitleBar, Body, BackButton, showToast, showErrorToast, Loader, Row, Col, Box, Circle, MIcon } from '../custom/components.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import EventBus from 'react-native-event-bus'
import moment from 'moment';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

class Chat extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        loading: false,
        text: '',
        models: [],
        adminStatus: 'Away'
    };

    render() {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus} onBlur={this.onBlur}>
                <TitleBar
                    canUpdate
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t48+' (' + this.state.adminStatus + ')'}
                    titlePos='flex-start' />
                <Body loading={this.state.loading} >
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ref={(ref) => this.flatList = ref}
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            data={this.state.models}
                            extraData={this.state} // refresh list on state change
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderItem} />
                    </View>
                    <Row center extraStyle={[{ height: 50, width: '100%', marginBottom: 0 }]}>
                        <Box extraStyle={[{ flex: 1 }]}>
                            <Input
                                ref={(input) => this.text = input}
                                placeholder={Strings.t49}
                                containerStyle={[stylesC.fieldCP]}
                                inputContainerStyle={[stylesC.fieldP, { height: 45, marginRight: 0, marginLeft: -10 }]}
                                inputStyle={[stylesC.field]}
                                textContentType='none' //Autofill > name,username,emailAddress,password...
                                keyboardType='default' //number-pad,decimal-pad,numeric,email-address,phone-pad
                                onChangeText={(text) => this.setState({ text: text })}
                                value={this.state.text} />
                        </Box>
                        <Col extraStyle={[{ marginTop: -2 }]}>
                            <Circle
                                fill={true}
                                shadow={false}
                                borderWidth={0}
                                activeOpacity={0.6}
                                size={50}
                                color={Colors.theme}
                                component={
                                    <MIcon
                                        style={[stylesC.center]}
                                        name='angle-right' //https://fontawesome.com/icons
                                        type='font-awesome'
                                        size={22}
                                        color={Colors.white} />
                                }
                                onPress={this.sendMessage} />
                        </Col>

                    </Row>
                </Body>
            </Screen>
        );
    }

    _renderItem = ({ item }) => (
        item.sender === 'user' ?
            <Col extraStyle={[{ marginBottom: 10 }]}>
                <Box topRight extraStyle={[{ alignSelf: 'flex-end', alignItems: 'flex-end', backgroundColor: Colors.themeDark, padding: 8, borderRadius: 10, marginBottom: 10 }]}>
                    <Text style={[stylesC.textD14, { color: 'white' }]}>
                        {item.message}
                    </Text>
                </Box>
                <Col>
                    <Text style={[stylesC.textD12, { color: 'gray', alignSelf: 'flex-end', marginTop: -5 }]}>
                        {this.getMessageTime(item)}
                    </Text>
                </Col>
            </Col>
            :
            <Col extraStyle={[{ marginBottom: 10 }]}>
                <Box topLeft extraStyle={[{ alignSelf: 'flex-start', alignItems: 'flex-start', backgroundColor: Colors.theme, padding: 8, borderRadius: 10, marginBottom: 10 }]}>
                    <Text style={[stylesC.textD14, { color: 'white' }]}>
                        {item.message}
                    </Text>
                </Box>
                <Col extraStyle={[{ marginTop: -5 }]}>
                    <Text style={[stylesC.textD12, { color: 'gray' }]}>
                        {this.getMessageTime(item)}
                    </Text>
                </Col>

            </Col>

    );

    getMessageTime = (model) => {
        let today = moment().format('DD/MM/YYYY')
        let date = moment(model.user_time, 'YYYY-MM-DD h:mm a').format('DD/MM/YYYY')
        if (today === date) {
            return moment(model.user_time, 'YYYY-MM-DD h:mm a').format('h:mm a')
        }
        return moment(model.user_time, 'YYYY-MM-DD h:mm a').format('h:mm a, ddd')
    };

    sendMessage = () => {
        if (this.state.text === '') {
            return
        }
        // add locally
        this.setState(state => {
            const model = {
                sender: 'user',
                message: this.state.text,
                user_id: this.props.user.id,
                user_time: moment().format('YYYY-MM-DD h:mm a')
            }
            const models = state.models.concat(model);
            return { models: models, text: '' };
        });
        setTimeout(() => {
            this.flatList.scrollToEnd()
        }, 1000);
        Api.sendMessage('user', this.props.user.id, this.state.text,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    //
                }
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

    onLeftPress = () => {
        this.props.navigation.goBack();
    };

    componentDidMount() {
        console.log("Chat mount");
        EventBus.getInstance().addListener('Notification', this.listener = data => {
            console.log('EVENT')
            this.loadList(false)
        })
        this.updateChatStatus('Online')
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
        this.updateChatStatus('Away')
    }

    updateChatStatus = (status) => {
        Api.updateChatStatus(status,
            (response) => {
                //
            },
            (error) => {
                //
            })
    };

    loginChecker = null
    
    onFocus = () => {
        console.log("Chat focus");
        this.loadList(true)
        this.isAdminOnline()
        this.loginChecker = setInterval(()=>{
            this.isAdminOnline()
        }, 3000)
    };

    onBlur = () => {
        console.log("Chat blur");
        clearInterval(this.loginChecker)
    };

    isAdminOnline = () => {
        Api.isAdminOnline(
            (response) => {
                if (response.status === 'success') {
                    this.setState({ adminStatus: response.data })
                }
            },
            (error) => {
                // this.setState({ loading: false });
                // showErrorToast('' + error);
            });
    };

    loadList = (loading) => {
        this.setState({ loading: loading })
        Api.getChat(this.props.user.id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    this.setState({ models: response.data })
                    setTimeout(() => {
                        this.flatList.scrollToEnd()
                    }, 1000);
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
    }
}
export default connect(mapStateToProps, {})(Chat)