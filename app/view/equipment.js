import React from 'react';
import { Text, Image, View, FlatList, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustomButton, showToast, showErrorToast, TitleBar, ListItem, Start, Center, End, } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import { connect } from 'react-redux';
import Api from '../api/api'
import MyImageViewer from '../util/image_viewer'

class Equipment extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        list: [],
        viewer: false,
        url: '',
    }

    onLeftPress = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t87}
                    titlePos='flex-start' />
                <MyImageViewer
                    ref={(ref) => this.imageViewer = ref} />
                <Body loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'stretch' }]}>

                        <View style={[{ marginTop: 0 }]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                horizontal={false}
                                data={this.state.list}
                                extraData={this.state} // refresh list on state change
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem} />
                        </View>

                        {!this.state.loading && this.state.list.length == 0 ?
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
                    {Strings.t88}
                </Text>
            </Col>
        )
    };

    _renderItem = ({ item, index }) => {
        return (
            <ListItem
                containerStyle={[stylesC.listItemP, { backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2' }]}
                activeOpacity={1}
                cardStyle={[stylesC.card, {}]}
                parentStyle={[stylesC.listItemCard, { padding: 10, backgroundColor: 'transparent' }]}
                onPress={() => {
                    // handle item click
                }}>
                <Start>

                </Start>
                <Center center extraStyle={[{}]}>
                    <TouchableOpacity
                        style={{ width: 200, height: 150 }}
                        activeOpacity={0.6}
                        onPress={() => {
                            this.setState({ url: this.props.fileUrls.Equipment + item.image })
                            // this.setState({ viewer: true })
                            this.imageViewer.showPopup(this.props.fileUrls.Equipment + item.image)
                        }}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 200, height: 150, borderWidth: 1, backgroundColor: index % 2 != 0 ? 'white' : '#F2F2F2', borderRadius: 5 }}
                            source={{ uri: this.props.fileUrls.Equipment + item.image }} />
                    </TouchableOpacity>

                    <Text style={[stylesC.textD16, { marginTop: 8 }]}>
                        {item.title}
                    </Text>
                    <Text style={[stylesC.textM14, { color: Colors.textMedium }]}>
                        {item.detail}
                    </Text>
                </Center>
                <End>

                </End>
            </ListItem>
        )
    }

    componentDidMount = () => {
        this.loadList()
    };

    onFocus = () => {
        console.log('onFocus');
    };

    loadList = () => {
        this.setState({ loading: true });
        Api.getEquipmentNeeds(
            (response) => {
                this.setState({ loading: false, list: response })
            },
            (error) => {
                this.setState({ loading: false });
                showErrorToast('' + error);
            });
    };

}

const mapStateToProps = state => {
    return {
        fileUrls: state.FileUrlsReducer.fileUrls
    }
}
export default connect(mapStateToProps, {})(Equipment)
