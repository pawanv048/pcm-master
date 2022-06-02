import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Body, Row, Button, IconCustom, ColButton, TitleBar, Line } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import Utils from '../util/utils.js';
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import MyStorage from '../storage/storage'

class LibraryLimited extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        parentCategory: null,
        categories: [],
        models: [],
    }

    onLeftPress = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <TitleBar
                    left
                    leftType='menu' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={Strings.t106}
                    titlePos='flex-start' />
                <Body scroll loading={this.state.loading} extraStyle={[{ paddingTop: 0, paddingHorizontal: 0, paddingBottom: 0, backgroundColor: 'white' }]}>

                    <Col extraStyle={[{ paddingHorizontal: 20, paddingBottom: 20, alignItems: 'stretch' }]}>

                        {/* <Text style={[stylesC.textD16, { marginTop: 10 }]}>
                            PCM Video Library
                        </Text> */}
                        <Text style={[stylesC.textM14, { marginTop: 10 }]}>
                            {Strings.t111}
                        </Text>

                        {this.state.parentCategory != null ?
                            <Col>
                                <Button
                                    label={'< '+Strings.t112}
                                    activeOpacity={0.6}
                                    buttonStyle={[stylesC.button45, { marginTop: 10, marginHorizontal: 0, backgroundColor: 'gray' }]}
                                    labelStyle={[stylesC.buttonT14]}
                                    onPress={this.goToParent} />
                                <Text style={[stylesC.textD14, { color: Colors.theme, marginTop: 10 }]}>
                                    {Strings.t113} {'> ' + this.state.parentCategory.title}
                                </Text>
                            </Col>
                            :
                            null
                        }

                        {this.state.models.map((model, index) => {
                            return (
                                <ColButton
                                    key={index.toString()}
                                    extraStyle={[{ marginTop: 10 }]}
                                    onPress={() => {
                                        this.onCategoryPress(model)
                                    }}>
                                    <Row>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 100, height: 220, borderRadius: 10, backgroundColor: '#fafafa' }}
                                            source={{ uri: this.props.fileUrls.LibraryImages + model.image }} />
                                        <Col extraStyle={[{ flex: 1, alignSelf: 'center' }]}>
                                            <Text style={[stylesC.textDB14, { marginLeft: 15, marginRight: 15, color: Colors.theme, fontSize: 18 }]}>
                                                {model.title}
                                            </Text>
                                            {model.videos > 0 ?
                                                <Text style={[stylesC.textDB14, { marginLeft: 15, color: Colors.gray, fontSize: 16 }]}>
                                                    {Strings.t108}: {model.videos}
                                                </Text>
                                                :
                                                null
                                            }
                                        </Col>
                                    </Row>
                                </ColButton>
                            )
                        })}

                    </Col>
                </Body>
            </Screen>
        );
    }

    goToParent = () => {
        console.log('GO BACK');
        let current = this.state.parentCategory;
        const rootId = current.parent_id + ''
        if (rootId === '0') {
            // this.props.setSelectedCategory(null)
            this.setState({ parentCategory: null, models: [] })
            this.loadSubcategories()
        }
        else {
            // find parent
            let root = null
            for (let i = 0; i < this.state.categories.length; i++) {
                const category = this.state.categories[i];
                if (category.id + '' === rootId) {
                    root = category
                }
            }
            // this.props.setSelectedCategory(root)
            this.setState({ parentCategory: root })
            this.loadSubcategories()
        }
    };

    onCategoryPress = (model) => {
        // check if this category has subcategories
        const parentId = model.id
        let subCategories = []
        for (let i = 0; i < this.props.categories.length; i++) {
            const category = this.props.categories[i];
            if (category.parent_id + '' === parentId + '') {
                subCategories = subCategories.concat(category)
            }
        }
        if (subCategories.length > 0) {
            console.log('size: ' + subCategories.length);
            // add these subcategories to categories
            let categories = this.state.categories
            for (let i = 0; i < subCategories.length; i++) {
                const subCat = subCategories[i];
                let exists = false
                for (let j = 0; j < this.state.categories.length; j++) {
                    const cat = this.state.categories[j];
                    if (cat.id + '' === subCat.id + '') {
                        exists = true
                        break
                    }
                }
                if (!exists)
                    categories = categories.concat(subCat)
            }
            this.setState({ categories: categories, models: subCategories, parentCategory: model })
            // this.setState({ parentCategory: model, models: subCategories })
        }
        else {
            if (this.props.user == null) {
                this.props.navigation.navigate('Login');
                return
            }
            // if (this.props.hasSubscribed === '0' && this.props.user.free_user + '' === '0') {
            //     this.props.navigation.navigate('Membership');
            //     return
            // }
            this.props.navigation.navigate('LibraryVideos', { category: model });
        }
    };

    componentDidMount() {
        console.log('componentDidMount');
        let parentCategory = this.props.navigation.getParam('parentCategory')
        console.log('parentCategory: ' + JSON.stringify(parentCategory));
        if (parentCategory != null)
            this.setState({ parentCategory: parentCategory, categories: [parentCategory] })
        else
            this.setState({ parentCategory: null, models: [] })
        this.loadSubcategories()
    }

    getParentCats = (cats) => {
        let parentCats = []
        for (let i = 0; i < cats.length; i++) {
            const cat = cats[i];
            if (cat.parent_id + '' === '0') {
                parentCats = parentCats.concat(cat)
            }
        }
        return parentCats
    };

    loadSubcategories = () => {
        setTimeout(() => {
            const parent = this.state.parentCategory
            if (parent == null) {
                // load parent categories
                console.log('load parent categories');
                this.setState({ models: this.getParentCats(this.state.categories) })
            }
            else {
                // load subcategories
                console.log('load subcategories');
                const parentId = parent.id
                let subCategories = []
                for (let i = 0; i < this.props.categories.length; i++) {
                    const category = this.props.categories[i];
                    if (category.parent_id + '' === parentId + '') {
                        subCategories = subCategories.concat(category)
                    }
                }
                console.log('size: ' + subCategories.length);
                // add these subcategories to categories
                let categories = this.state.categories
                for (let i = 0; i < subCategories.length; i++) {
                    const subCat = subCategories[i];
                    let exists = false
                    for (let j = 0; j < this.state.categories.length; j++) {
                        const cat = this.state.categories[j];
                        if (cat.id + '' === subCat.id + '') {
                            exists = true
                            break
                        }
                    }
                    if (!exists)
                        categories = categories.concat(subCat)
                }
                this.setState({ categories: categories, models: subCategories })
            }
        }, 50);
    };

    onFocus = () => {
        console.log('onFocus');
    };

}

const mapDispatchToProps = dispatch => {
    return {

    }
}

const mapStateToProps = (state) => {
    return {
        user: state.UserReducer.user,
        fileUrls: state.FileUrlsReducer.fileUrls,
        categories: state.CategoriesReducer.categories,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryLimited)