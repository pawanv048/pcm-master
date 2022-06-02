import React from 'react';
import { Text, View, FlatList, TextInput, KeyboardAvoidingView, Platform, TextInputBase } from 'react-native';
import { stylesC } from '../styles/style_common.js';
import { Screen, Col, Line, Body, Row, IconCustomButton, TitleBar, Button, EditText, showToast, showErrorToast } from '../custom/components.js';
import * as Colors from '../constants/colors.js';
import * as Strings from '../constants/strings.js';
import { Input } from 'react-native-elements';
import Utils from '../util/utils.js';
import Api from '../api/api'
import { connect } from 'react-redux';
import { Actions } from '../redux/Actions'
import ProgramPicker from '../util/program_picker'

const defaultExercise = { title: '', sets: '1', video_id: '' }

class AddWeeklyProgram extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        loading: false,
        masterId: Utils.randomFixedNumber(6),
        title: '',
        // allWeekdayPrograms: [{ "exercises": [{ "title": "Sun ex1", "sets": "2", "video_id": "video1" }] }, { "exercises": [{ "title": "Mon ex1", "sets": "2", "video_id": "video1" }] }, { "exercises": [{ "title": "Tue ex1", "sets": "2", "video_id": "video1" }] }, { "exercises": [{ "title": "Wed ex1", "sets": "2", "video_id": "video1" }] }, { "exercises": [{ "title": "Thu ex1", "sets": "2", "video_id": "video1" }] }, { "exercises": [{ "title": "Fri ex1", "sets": "2", "video_id": "video1" }] }, { "exercises": [{ "title": "Sat ex1", "sets": "2", "video_id": "video1" }] }],
        allWeekdayPrograms: [
            {
                exercises: [defaultExercise]
            },
            {
                exercises: [defaultExercise]
            },
            {
                exercises: [defaultExercise]
            },
            {
                exercises: [defaultExercise]
            },
            {
                exercises: [defaultExercise]
            },
            {
                exercises: [defaultExercise]
            },
            {
                exercises: [defaultExercise]
            },
        ],
        settingIndex: 0, // unused
        weekDay: 0,
        weekDays: [
            Strings.t2, Strings.t3, Strings.t4, Strings.t5, Strings.t6, Strings.t7, Strings.t8
        ],
        fullWeekDays: [
            Strings.t9, Strings.t10, Strings.t11, Strings.t12, Strings.t13, Strings.t14, Strings.t15
        ],
        allWeekdayProgramsLive: [], // edit mode
        allSinglePrograms: [], // to enable choose some program for auto entry
    }

    render() {
        if (this.props.user == null) {
            this.props.navigation.navigate('Login');
            return null
        }
        return (
            <Screen statusBarTint='white' onFocus={this.onFocus}>
                <ProgramPicker
                    ref={(ref) => this.programPicker = ref}
                    onSelect={(program) => {
                        console.log('selected: ' + JSON.stringify(program));
                        this.loadProgramExercises(program)
                        // let allWeekdayPrograms = this.state.allWeekdayPrograms
                        // allWeekdayPrograms[this.state.weekDay].exercises = program.exercises
                        // this.setState({ allWeekdayPrograms: allWeekdayPrograms })
                    }} />
                <TitleBar
                    canUpdate
                    left
                    leftType='back' // back/menu
                    onLeftPress={this.onLeftPress}
                    title={this.state.allWeekdayProgramsLive.length == 0 ? Strings.t33 : Strings.t34}
                    titlePos='flex-start' />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={{ flex: 1 }}>
                    <Body
                        loading={this.state.loading}
                        extraStyle={[{ paddingHorizontal: 0, paddingVertical: 0 }]}>
                        <Col extraStyle={[{ backgroundColor: 'white', marginTop: 0, borderRadius: 10, paddingHorizontal: 20, marginTop: 0, marginBottom: 0, borderWidth: 0, borderColor: Colors.lineLight }]}>
                            <View style={{ width: '100%', marginTop: 0 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    horizontal={false}
                                    data={this.weekdayProgram().exercises}
                                    extraData={this.state} // refresh list on state change
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this._renderExercisesItem}
                                    ListHeaderComponent={this.showHeader}
                                    ListFooterComponent={this.showListFooter} />
                            </View>
                        </Col>
                    </Body>
                </KeyboardAvoidingView>
            </Screen>
        );
    }

    weekdayProgram = () => {
        return this.state.allWeekdayPrograms[this.state.weekDay]
    };

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
                    if (this.state.allWeekdayProgramsLive.length > 0) { // edit mode
                        setTimeout(() => {
                            this.loadProgramLive(this.state.allWeekdayProgramsLive)
                            // if (index < this.state.allWeekdayProgramsLive.length) {
                            //     this.loadProgramLive(this.state.allWeekdayProgramsLive)
                            // }
                            // else {
                            //     // do nothing
                            // }
                        }, 50);
                    }
                    else {
                        console.log('ZERO');
                    }
                }} />
        )
    };

    showHeader = () => {
        return (
            <Col extraStyle={[{ alignItems: 'stretch', marginBottom: 10, marginTop: 15 }]}>
                <EditText
                    reference={(input) => this.title = input}
                    extraStyle={{ paddingHorizontal: 0, marginTop: 0, width: '100%' }}
                    placeholder={Strings.t18} // placeholder/label
                    value={this.state.title}
                    keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                    onChangeText={(text) => {
                        this.setState({ title: text })
                    }}
                    blurOnSubmit
                    onSubmitEditing={() => {
                        //
                    }} />
                <Row spaceBetween extraStyle={[{ marginTop: 10 }]}>
                    {this.state.weekDays.map((item, index) => {
                        return this.showWeekDay(item, index)
                    })}
                </Row>
                <Button
                    canUpdate
                    label={Strings.t35}
                    activeOpacity={0.6}
                    buttonStyle={[stylesC.buttonO30, { marginTop: 10, marginHorizontal: 0, height: 40 }]}
                    labelStyle={[stylesC.buttonOT14]}
                    onPress={this.chooseFromPrograms} />
                {/* {this.state.allWeekdayProgramsLive.length == 0 ?
                    <Button
                        canUpdate
                        label='Choose from Added Programs'
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.buttonO30, { marginTop: 10, marginHorizontal: 0, height: 40 }]}
                        labelStyle={[stylesC.buttonOT14]}
                        onPress={this.chooseFromPrograms} />
                    :
                    null
                } */}

            </Col>
        )
    }

    chooseFromPrograms = () => {
        if (this.state.allSinglePrograms.length == 0) {
            showErrorToast(Strings.t36)
            return
        }
        this.programPicker.showPopup(this.state.allSinglePrograms)
    };

    showListFooter = () => {
        return (
            <Col center>
                <Col center>
                    <IconCustomButton
                        conatinerStyle={[stylesC.center, { width: '10%', marginBottom: 10 }]}
                        imageStyle={[stylesC.imageM30, { width: 40, height: 40, tintColor: Colors.green, alignSelf: 'center' }]}
                        resizeMode='contain'
                        source={require('../assets/add.png')}
                        onPress={this.addExercise} />
                </Col>

                {this.state.weekDay < 6 ?
                    <Button
                        canUpdate
                        label={Strings.t37}
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.button45, { marginTop: 5 }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={this.moveToNext} />
                    :
                    null
                }
                <Button
                    canUpdate
                    label={Strings.t38}
                    activeOpacity={0.6}
                    buttonStyle={[stylesC.button45, { marginTop: 5, backgroundColor: Colors.themeDark }]}
                    labelStyle={[stylesC.buttonT16]}
                    onPress={this.saveAll} />

                {/* {this.state.allWeekdayProgramsLive.length == 0 ?
                    <Button // add mode
                        canUpdate
                        label={this.state.weekDay < 6 ? 'Next' : 'Save All'}
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.button45, { marginTop: 5 }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={this.addNewProgram} />
                    :
                    <Button // edit mode
                        canUpdate
                        label={'Save'}
                        activeOpacity={0.6}
                        buttonStyle={[stylesC.button45, { marginTop: 5 }]}
                        labelStyle={[stylesC.buttonT16]}
                        onPress={this.updateProgram} />
                } */}

                <Text style={[stylesC.textM12, { marginTop: 5, marginBottom: 20 }]}>
                    <Text style={[stylesC.textM12, { color: 'red' }]}>{Strings.t39}:</Text> {Strings.t40} "{this.state.fullWeekDays[this.state.weekDay]}" {Strings.t41}.
                </Text>
            </Col>
        )
    };

    moveToNext = () => {
        if (this.state.weekDay < 6) {
            // move to next
            this.setState({ weekDay: this.state.weekDay + 1 })
        }
    };

    _renderExercisesItem = ({ item, index }) => {
        // console.log('_renderField index: '+index);
        return (
            <Col center>
                <Row spaceBetween>
                    <Text style={[stylesC.textD16, { marginBottom: 15, marginTop: 5, color: Colors.theme }]}>
                        {Strings.t21} {index + 1}
                    </Text>
                    <IconCustomButton
                        conatinerStyle={[stylesC.center, { width: '10%', marginBottom: 10 }]}
                        imageStyle={[stylesC.imageM24, { tintColor: Colors.red }]}
                        resizeMode='contain'
                        source={require('../assets/remove.png')}
                        onPress={() => {
                            this.removeExercise(item, index);
                        }} />
                </Row>
                <Col extraStyle={[{}]}>
                    <Text style={[stylesC.textM12]}>
                        {Strings.t42}
                    </Text>
                    <Row extraStyle={[{ marginTop: 5 }]}>
                        <Col extraStyle={[{ flex: 1, alignItems: 'stretch', borderColor: Colors.textLight, borderBottomWidth: 1, }]}>
                            <TextInput
                                autoCapitalize='none'
                                style={{ fontSize: 15, height: 40, backgroundColor: '#fafafa', paddingHorizontal: 10 }}
                                placeholderTextColor={Colors.textLight}
                                placeholder={''} // placeholder/label
                                value={item.video_id}
                                keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                                onChangeText={(text) => {
                                    this.updateField('video_id', item, index, text)
                                }}
                                blurOnSubmit={true}
                                onSubmitEditing={() => {
                                    //
                                }} />
                        </Col>
                        <Button
                            label={Strings.t23}
                            activeOpacity={0.6}
                            buttonStyle={[stylesC.buttonO45, { marginLeft: 10, height: 40, width: 100 }]}
                            labelStyle={[stylesC.buttonOT14]}
                            onPress={() => {
                                this.item = item
                                this.index = index
                                this.props.navigation.navigate('ChooseVideo', { from: 'AddWeeklyProgram' });
                                // Utils.moveToScreen(this.props.navigation, 'HomeStack', 'ChooseVideo')
                            }} />
                    </Row>
                </Col>
                <Col extraStyle={[{ marginTop: 10, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                    <Text style={[stylesC.textM12]}>
                        {Strings.t24}
                    </Text>
                    <TextInput
                        style={{ marginHorizontal: 0, flex: 1, fontSize: 15, width: '100%', height: 40, backgroundColor: '#fafafa', marginTop: 5, paddingHorizontal: 10 }}
                        placeholderTextColor={Colors.textLight}
                        placeholder={''} // placeholder/label
                        value={item.title}
                        keyboardType='default' // number-pad, decimal-pad, numeric, email-address, phone-pad
                        onChangeText={(text) => {
                            this.updateField('title', item, index, text)
                        }}
                        blurOnSubmit={true}
                        onSubmitEditing={() => {
                            //
                        }} />
                </Col>
                <Col extraStyle={[{ marginTop: 10, marginBottom: 15, borderColor: Colors.textLight, borderBottomWidth: 1 }]}>
                    <Text style={[stylesC.textM12]}>
                        {Strings.t43}
                    </Text>
                    <TextInput
                        style={{ marginHorizontal: 0, flex: 1, fontSize: 15, width: '100%', height: 40, backgroundColor: '#fafafa', marginTop: 5, paddingHorizontal: 10 }}
                        placeholderTextColor={Colors.textLight}
                        placeholder={''} // placeholder/label
                        value={item.sets + ''}
                        keyboardType='number-pad' // number-pad, decimal-pad, numeric, email-address, phone-pad
                        onChangeText={(text) => {
                            this.updateField('sets', item, index, text)
                        }}
                        blurOnSubmit={true}
                        onSubmitEditing={() => {
                            //
                        }} />
                </Col>
            </Col>
        )
    }

    addExercise = () => {
        this.setState(state => {
            const exercises = state.allWeekdayPrograms[this.state.weekDay].exercises.concat(defaultExercise);
            let allWeekdayPrograms = state.allWeekdayPrograms
            allWeekdayPrograms[this.state.weekDay].exercises = exercises
            return { allWeekdayPrograms: allWeekdayPrograms };
        });
    };

    updateField = (fieldName, item, index, text) => {
        this.setState(state => {
            const exercises = state.allWeekdayPrograms[this.state.weekDay].exercises.map((exercise, i) => {
                if (i === index) {
                    console.log('edit: ' + i);
                    // edit
                    return {
                        ...exercise,
                        [fieldName]: text
                    };
                }
                else {
                    return exercise;
                }
            });
            let allWeekdayPrograms = state.allWeekdayPrograms
            allWeekdayPrograms[this.state.weekDay].exercises = exercises
            return { allWeekdayPrograms: allWeekdayPrograms };
        });
    };

    removeExercise = (item, index) => {
        // if (this.state.exercises.length == 1) return;
        this.setState(state => {
            const exercises = state.allWeekdayPrograms[this.state.weekDay].exercises.filter((item, i) => {
                return index !== i; //false will delete
            });
            let allWeekdayPrograms = state.allWeekdayPrograms
            allWeekdayPrograms[this.state.weekDay].exercises = exercises
            return { allWeekdayPrograms: allWeekdayPrograms };
        });
    };

    saveAll = () => {
        if (this.state.allWeekdayProgramsLive.length > 0) {
            this.updateAll()
            return
        }
        console.log('saveAll');
        if (this.state.title === '') {
            showErrorToast(Strings.t27)
            return
        }
        // check if anything empty in selected program
        for (let i = 0; i < this.weekdayProgram().exercises.length; i++) {
            const exercise = this.weekdayProgram().exercises[i];
            if (exercise.title === '' || exercise.sets === '' || exercise.video_id === '') {
                showErrorToast(Strings.t29)
                return;
            }
            if (parseInt(exercise.sets) > 10) {
                showErrorToast(Strings.t30)
                return;
            }
        }

        // save all programs having data
        let weekdayPrograms = []
        for (let j = 0; j < this.state.allWeekdayPrograms.length; j++) {
            const weekdayProgram = this.state.allWeekdayPrograms[j];
            let weekday = this.state.weekDays[j]
            let exercises = []
            for (let i = 0; i < weekdayProgram.exercises.length; i++) {
                const exercise = weekdayProgram.exercises[i];
                if (exercise.title === '' || exercise.sets === '' || exercise.video_id === '') {
                    // showErrorToast('Empty fields for some weekday program!')
                    // return;
                    continue
                }
                exercises = exercises.concat({
                    title: exercise.title,
                    sets: exercise.sets,
                    video_id: exercise.video_id,
                })
            }

            // skip weekday programs having no exercises
            if (exercises.length > 0) {
                let program = {
                    weekday: weekday,
                    exercises: exercises
                }
                weekdayPrograms = weekdayPrograms.concat(program)
            }

            // check if loop reached selected weekday
            // if (j === this.state.weekDay)
            //     break;
        }

        let userId = this.props.user.id
        let title = this.state.title
        this.addWeeklyProgram(userId, title, weekdayPrograms)
    };

    updateAll = () => {
        console.log('updateAll');
        if (this.state.title === '') {
            showErrorToast(Strings.t27)
            return
        }
        // check if anything empty
        for (let i = 0; i < this.weekdayProgram().exercises.length; i++) {
            const exercise = this.weekdayProgram().exercises[i];
            if (exercise.title === '' || exercise.sets === '' || exercise.video_id === '') {
                showErrorToast(Strings.t29)
                return;
            }
        }

        this.setState({ loading: true });
        let title = this.state.title

        // update all programs having data
        for (let j = 0; j < this.state.allWeekdayPrograms.length; j++) {
            const weekdayProgram = this.state.allWeekdayPrograms[j];
            let weekday = this.state.weekDays[j]
            let exercises = []
            for (let i = 0; i < weekdayProgram.exercises.length; i++) {
                const exercise = weekdayProgram.exercises[i];
                if (exercise.title === '' || exercise.sets === '' || exercise.video_id === '') {
                    // showErrorToast('Empty fields for some weekday program!')
                    // return;
                    continue
                }
                exercises = exercises.concat({
                    title: exercise.title,
                    sets: exercise.sets,
                    video_id: exercise.video_id,
                })
            }

            // skip weekday programs having no exercises
            if (exercises.length > 0) {
                // get program id to update
                let program = null
                for (let k = 0; k < this.state.allWeekdayProgramsLive.length; k++) {
                    const p = this.state.allWeekdayProgramsLive[k];
                    console.log('weekday: ' + p.program.weekday);
                    if (p.program.weekday === weekday) {
                        program = p.program
                    }
                }
                if (program == null) {
                    // add program
                    console.log('add program');
                    Api.addProgram(this.state.allWeekdayProgramsLive[0].program.master_id, this.props.user.id, title, weekday, JSON.stringify(exercises),
                        (response) => {
                            console.log('addProgram: ' + JSON.stringify(response));
                            this.setState({ loading: false })
                            if (response.status === 'success') {
                                showToast(Strings.t32)
                            }
                            else {
                                showErrorToast(response.msg)
                            }
                        },
                        (error) => {
                            this.setState({ loading: false });
                            showErrorToast('' + error);
                        });
                }
                else {
                    // update program
                    Api.updateWeeklyProgram(program.master_id, program.id, JSON.stringify(exercises), title,
                        (response) => {
                            console.log('updateWeeklyProgram: ' + JSON.stringify(response));
                            if (j === this.state.weekDay)
                                this.setState({ loading: false })
                            if (response.status === 'success') {
                                if (j === this.state.weekDay)
                                    showToast(Strings.t32)
                                // update title for all programs
                                for (let i = 0; i < this.state.allWeekdayProgramsLive.length; i++) {
                                    this.state.allWeekdayProgramsLive[i].program.title = title
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
                }
            }

            // check if loop reached selected weekday
            // if (j === this.state.weekDay)
            //     break;
        }
    };

    addWeeklyProgram = (userId, title, weekdayPrograms) => {
        console.log('weekdayPrograms: ' + JSON.stringify(weekdayPrograms));
        this.setState({ loading: true })
        Api.addWeeklyProgram(this.state.masterId, userId, title, JSON.stringify(weekdayPrograms),
            (response) => {
                console.log('addWeeklyProgram: ' + JSON.stringify(response));
                this.setState({ loading: false })
                if (response.status === 'success') {
                    showToast(Strings.t31)
                    this.props.navigation.goBack()
                    // if (this.state.weekDay < 6) {
                    //     this.setState({ weekDay: this.state.weekDay + 1 })
                    // }
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

    onLeftPress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        console.log('componentDidMount')
        const programs = this.props.navigation.getParam('programs');
        const allSinglePrograms = this.props.navigation.getParam('singlePrograms');
        if (allSinglePrograms) {
            this.setState({ allSinglePrograms: allSinglePrograms })
        }
        if (programs) { // edit mode
            this.loadProgramLive(programs)
        }
    }

    onFocus = () => {
        console.log('onFocus');
        const copiedVideoID = this.props.navigation.getParam('copiedVideoID');
        const videoTitle = this.props.navigation.getParam('videoTitle');
        if (copiedVideoID) {
            this.updateField('title', this.item, this.index, videoTitle)
            setTimeout(() => {
                this.updateField('video_id', this.item, this.index, copiedVideoID)
            }, 50);
        }
    };

    loadProgramLive = (allWeekdayProgramsLive) => {
        this.setState({ allWeekdayProgramsLive: allWeekdayProgramsLive, title: allWeekdayProgramsLive[0].program.title })
        let weekdayName = this.state.weekDays[this.state.weekDay]
        for (let i = 0; i < allWeekdayProgramsLive.length; i++) {
            const program = allWeekdayProgramsLive[i].program;
            if (program.weekday === weekdayName) {
                this.loadProgramExercises(program)
                return
            }
        }
        // do nothing - program does not exist
    };

    loadProgramExercises = (program) => {
        console.log('program: ' + JSON.stringify(program));
        console.log('weekDay: ' + this.state.weekDay);
        this.setState({ loading: true });
        Api.getProgramExercises(program.id,
            (response) => {
                this.setState({ loading: false })
                if (response.status === 'success') {
                    let exercises = response.data
                    if (exercises.length != 0) {
                        let allWeekdayPrograms = this.state.allWeekdayPrograms
                        allWeekdayPrograms[this.state.weekDay].exercises = exercises
                        this.setState({ allWeekdayPrograms: allWeekdayPrograms })
                    }
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
        user: state.UserReducer.user
    }
}
export default connect(mapStateToProps, {})(AddWeeklyProgram)
