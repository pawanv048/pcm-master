import {StyleSheet} from 'react-native';
import * as Colors from '../constants/colors.js';

// settings
const mainSidePadding = 15;
const drawerHeaderHeight = 200;
const sliderHeight = 200;
// Logo
const logoSize = 250;
export const loginLogoSize = 120;

// Form / Input Field
const fieldHeight = 35;
const fieldRadius = 5;
const fieldBorderW = 1;
const fieldPaddingH = 0; // use it when no icon with input
const fieldFontSize = 16;
export const fieldMarginB = 15;
export const fieldMarginH = 0; // text margin inside
export const fieldLook = 'underline'; // border/underline
export const fieldTextAlign = 'left';
export const fieldShowLeftIcon = false;

// Button
const buttonRadius = 10;
const buttonBorderW = 1;
// Line
const lineSize = 1;
// Popup
const popupHeight = 300;
const popupWidth = 300;
// Floating Button
const floatingButtonSize = 70;
const floatingButtonMargin = 20;
// Badge
const badgeSize = 20;
const badgeMarginTop = -5;
const badgeMarginLeft = 15;
// Loader
export const loaderSize = 45;

export const getCircleEmpty = (size,color,border)=>{
  return {borderWidth:border,borderColor:color,alignItems:'center',justifyContent:'center',width:size,height:size,borderRadius:size/2};
};

export const getCircleFill = (size,color)=>{
  return {backgroundColor:color,alignItems:'center',justifyContent:'center',width:size,height:size,borderRadius:size/2,borderWidth:1,borderColor:'white'};
};

export const stylesC = StyleSheet.create({
  // dummies
  textWhite:{color:Colors.white},
  flex1:{flex:1},
  noBorderRadius:{borderRadius:0},
  // container
  main:{flex:1,backgroundColor:Colors.background,paddingHorizontal:mainSidePadding,paddingVertical:mainSidePadding,alignItems:'stretch'},
  mainNoPadding:{flex:1,backgroundColor:Colors.background,alignItems:'stretch'},
  mainWithLoader:{flex:1,backgroundColor:Colors.background,alignItems:'stretch',justifyContent:'center',paddingHorizontal:mainSidePadding,paddingVertical:mainSidePadding},
  // splash
  mainSplash:{flex:1,backgroundColor:Colors.background,alignItems:'center',justifyContent:'center'},
  logoSplash:{width:logoSize,height:logoSize},
  // loader (spinner/progressbar)
  loader:{position:'absolute',alignSelf:'center',alignItems:'center',justifyContent:'center'},
  // header
  header:{backgroundColor:Colors.theme},
  headerLeftP:{marginLeft:0,marginTop:1,justifyContent:'center'},
  headerLeftIcon:{padding:10},
  headerRightP:{flexDirection:'row',alignItems:'center',justifyContent:'center'},
  headerRightIconP:{alignItems:'center',justifyContent:'center',padding:10},
  // header title
  headerTitleP:{flex:2,flexDirection:'row',justifyContent:'center'},
  headerTitle:{color:Colors.headerTint},
  // drawer header
  drawerHeader:{width:'100%',height:drawerHeaderHeight,alignItems:'center',justifyContent:'center',backgroundColor:Colors.drawerHeader},
  // slider
  slider:{width:'100%',height:sliderHeight},
  sliderImage:{width:'100%',height:'100%'},
  // parents
  stretch:{alignItems:'stretch'},
  center:{alignItems:'center',justifyContent:'center'},
  centerStretch:{alignItems:'stretch',justifyContent:'center'},
  centerV:{justifyContent:'center'},
  centerH:{alignItems:'center'},
  // row
  rowStart:{alignSelf:'stretch',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'},
  rowCenter:{alignSelf:'stretch',flexDirection:'row',justifyContent:'center',alignItems:'center'},
  rowEnd:{alignSelf:'stretch',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'},
  rowCenter:{alignSelf:'stretch',flexDirection:'row',alignItems:'center',justifyContent:'center'},
  rowStretch:{alignSelf:'stretch',alignItems:'stretch'},
  rowTop:{alignSelf:'stretch',alignItems:'flex-start'},
  rowMiddle:{alignSelf:'stretch',alignItems:'center'},
  rowBottom:{alignSelf:'stretch',alignItems:'flex-end'},
  rowSpaceBetween:{alignSelf:'stretch',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  rowSpaceAround:{alignSelf:'stretch',flexDirection:'row',alignItems:'center',justifyContent:'space-around'},
  rowSpaceEvenly:{alignSelf:'stretch',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'},
  // col
  colStart:{alignSelf:'stretch',alignItems:'flex-start'},
  colCenter:{alignSelf:'stretch',alignItems:'center'},
  colEnd:{alignSelf:'stretch',alignItems:'flex-end'},
  colStretch:{alignSelf:'stretch',alignItems:'stretch'},
  colTop:{alignSelf:'stretch',justifyContent:'flex-start'},
  colMiddle:{alignSelf:'stretch',justifyContent:'center'},
  colBottom:{alignSelf:'stretch',justifyContent:'flex-end'},
  colSpaceBetween:{alignSelf:'stretch',justifyContent:'space-between'},
  colSpaceAround:{alignSelf:'stretch',justifyContent:'space-around'},
  colSpaceEvenly:{alignSelf:'stretch',justifyContent:'space-evenly'},
  // colWrap
  colWrapStart:{alignItems:'flex-start'},
  colWrapCenter:{alignItems:'center'},
  colWrapEnd:{alignItems:'flex-end'},
  colWrapStretch:{alignItems:'stretch'},
  colWrapTop:{justifyContent:'flex-start'},
  colWrapMiddle:{justifyContent:'center'},
  colWrapBottom:{justifyContent:'flex-end'},
  colWrapSpaceBetween:{justifyContent:'space-between'},
  colWrapSpaceAround:{justifyContent:'space-around'},
  colWrapSpaceEvenly:{justifyContent:'space-evenly'},
  // popup
  popupMain:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'},
  popupOutsideArea:{position: 'absolute',top: 0,bottom: 0,left: 0,right: 0,backgroundColor: 'rgba(0,0,0,0.5)'},
  popupContent:{height:popupHeight,width:popupWidth,backgroundColor:Colors.background,alignItems:'stretch'},
  // list
  listItemP:{marginHorizontal:0},
  listItem:{margin:10,alignSelf:'stretch',flexDirection:'row',alignItems:'stretch',backgroundColor:Colors.white},
  card:{margin:0,marginBottom:10,padding:10,alignItems:'stretch'},
  cardHeader:{flexDirection:'row',justifyContent:'space-between',height:45,backgroundColor:Colors.background,borderBottomWidth:1,borderBottomColor:Colors.fieldBorder},
  cardFooter:{flexDirection:'row',justifyContent:'space-between',height:45,backgroundColor:Colors.background,borderTopWidth:1,borderTopColor:Colors.fieldBorder},
  listItemCard:{alignSelf:'stretch',flexDirection:'row',alignItems:'stretch',backgroundColor:Colors.white},
  listLeft:{alignItems:'center',marginRight:10,justifyContent:'center'},
  listCenter:{justifyContent:'center',paddingHorizontal:0,flex:1},
  listRight:{width:50},
  // grid
  gridItemP:{marginLeft:10},
  gridItem:{margin:10,alignSelf:'stretch',alignItems:'stretch',backgroundColor:Colors.white},
  gridTop:{alignItems:'center',justifyContent:'center'},
  gridBottom:{marginTop:5,alignItems:'center',justifyContent:'center'},
  // menu (drawer)
  menuItemP:{marginHorizontal:0},
  menuItem:{margin:12,alignSelf:'stretch',flexDirection:'row',alignItems:'stretch',backgroundColor:Colors.white},
  menuLeft:{alignItems:'center',justifyContent:'center',marginLeft:10,width:30},
  menuCenter:{justifyContent:'center',paddingHorizontal:15,flex:4},
  menuRight:{alignItems:'center',justifyContent:'center',flex:1},
  // fields
  fieldCP:{height:fieldHeight},
  fieldP:{flexDirection:'row',height:fieldHeight,borderRadius:fieldRadius,borderWidth:fieldBorderW,borderBottomWidth:fieldBorderW,alignItems:'center',paddingHorizontal:fieldPaddingH,marginBottom:fieldMarginB,borderColor:Colors.fieldBorder,backgroundColor:Colors.fieldBackground},
  fieldPUnderline:{borderBottomWidth:fieldBorderW,borderBottomColor:Colors.fieldBorder},
  field:{marginHorizontal:8,color:Colors.textDark,fontSize:fieldFontSize},
  fieldWithIcon:{flex:1,color:Colors.textDark,fontSize:fieldFontSize},
  fieldPCountry:{flexDirection:'row',height:fieldHeight,borderRadius:fieldRadius,borderWidth:fieldBorderW,alignItems:'center',paddingHorizontal:fieldPaddingH,marginBottom:fieldMarginB,borderColor:Colors.fieldBorder,backgroundColor:Colors.fieldBackground},
  fieldCountry:{color:Colors.textDark,fontSize:fieldFontSize,marginLeft:10},
  // borders
  border:{alignItems:'center',justifyContent:'center',borderColor:Colors.fieldBorder,borderWidth:fieldBorderW,borderRadius:fieldRadius},
  borderOnly:{borderColor:Colors.fieldBorder,borderWidth:fieldBorderW},
  borderTransparent:{alignItems:'center',justifyContent:'center',borderColor:Colors.fieldBorder,borderWidth:fieldBorderW,borderRadius:fieldRadius,backgroundColor:'transparent'},
  // social buttons
  buttonFb50:{backgroundColor:Colors.buttonFacebook,marginHorizontal:0,alignSelf:'stretch',height:50,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonFb45:{backgroundColor:Colors.buttonFacebook,marginHorizontal:0,alignSelf:'stretch',height:45,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonG50:{backgroundColor:Colors.buttonGoogle,marginHorizontal:0,alignSelf:'stretch',height:50,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonG45:{backgroundColor:Colors.buttonGoogle,marginHorizontal:0,alignSelf:'stretch',height:45,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  // buttons 50
  button50:{alignSelf:'stretch',height:50,backgroundColor:Colors.button,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonD50:{alignSelf:'stretch',height:50,backgroundColor:Colors.themeDark,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonO50:{alignSelf:'stretch',height:50,borderRadius:buttonRadius,borderWidth:buttonBorderW,borderColor:Colors.button,alignItems:'center',justifyContent:'center'},
  buttonDO50:{alignSelf:'stretch',height:50,borderRadius:buttonRadius,borderWidth:buttonBorderW,borderColor:Colors.themeDark,alignItems:'center',justifyContent:'center'},
  buttonR50:{alignSelf:'stretch',height:50,backgroundColor:Colors.button,borderRadius:25,alignItems:'center',justifyContent:'center'},
  buttonDR50:{alignSelf:'stretch',height:50,backgroundColor:Colors.themeDark,borderRadius:25,alignItems:'center',justifyContent:'center'},
  buttonOR50:{alignSelf:'stretch',height:50,borderRadius:25,borderWidth:buttonBorderW,borderColor:Colors.button,alignItems:'center',justifyContent:'center'},
  buttonDOR50:{alignSelf:'stretch',height:50,borderRadius:25,borderWidth:buttonBorderW,borderColor:Colors.themeDark,alignItems:'center',justifyContent:'center'},
  // buttons 45
  button45:{alignSelf:'stretch',height:45,backgroundColor:Colors.button,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonD45:{alignSelf:'stretch',height:45,backgroundColor:Colors.themeDark,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonO45:{alignSelf:'stretch',height:45,borderRadius:buttonRadius,borderWidth:buttonBorderW,borderColor:Colors.button,alignItems:'center',justifyContent:'center'},
  buttonDO45:{alignSelf:'stretch',height:45,borderRadius:buttonRadius,borderWidth:buttonBorderW,borderColor:Colors.themeDark,alignItems:'center',justifyContent:'center'},
  buttonR45:{alignSelf:'stretch',height:45,backgroundColor:Colors.button,borderRadius:22.5,alignItems:'center',justifyContent:'center'},
  buttonDR45:{alignSelf:'stretch',height:45,backgroundColor:Colors.themeDark,borderRadius:22.5,alignItems:'center',justifyContent:'center'},
  buttonOR45:{alignSelf:'stretch',height:45,borderRadius:22.5,borderWidth:buttonBorderW,borderColor:Colors.button,alignItems:'center',justifyContent:'center'},
  buttonDOR45:{alignSelf:'stretch',height:45,borderRadius:22.5,borderWidth:buttonBorderW,borderColor:Colors.themeDark,alignItems:'center',justifyContent:'center'},
  // buttons 30
  button30:{alignSelf:'stretch',height:30,backgroundColor:Colors.button,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonD30:{alignSelf:'stretch',height:30,backgroundColor:Colors.themeDark,borderRadius:buttonRadius,alignItems:'center',justifyContent:'center'},
  buttonO30:{alignSelf:'stretch',height:30,borderRadius:buttonRadius,borderWidth:buttonBorderW,borderColor:Colors.button,alignItems:'center',justifyContent:'center'},
  buttonDO30:{alignSelf:'stretch',height:30,borderRadius:buttonRadius,borderWidth:buttonBorderW,borderColor:Colors.themeDark,alignItems:'center',justifyContent:'center'},
  buttonR30:{alignSelf:'stretch',height:30,backgroundColor:Colors.button,borderRadius:15,alignItems:'center',justifyContent:'center'},
  buttonDR30:{alignSelf:'stretch',height:30,backgroundColor:Colors.themeDark,borderRadius:15,alignItems:'center',justifyContent:'center'},
  buttonOR30:{alignSelf:'stretch',height:30,borderRadius:15,borderWidth:buttonBorderW,borderColor:Colors.button,alignItems:'center',justifyContent:'center'},
  buttonDOR30:{alignSelf:'stretch',height:30,borderRadius:15,borderWidth:buttonBorderW,borderColor:Colors.themeDark,alignItems:'center',justifyContent:'center'},
  // button texts
  buttonT16:{color:Colors.white,fontSize:16},
  buttonOT16:{color:Colors.button,fontSize:16},
  buttonDOT16:{color:Colors.themeDark,fontSize:16},
  buttonT14:{color:Colors.white,fontSize:14},
  buttonOT14:{color:Colors.button,fontSize:14},
  buttonDOT14:{color:Colors.themeDark,fontSize:14},
  // thumbnail
  thumbnail:{backgroundColor:Colors.thumbnail,borderWidth:fieldBorderW,borderColor:Colors.fieldBorder},
  // native-base <Icon/>
  iconP:{padding:5},
  iconD30:{color:Colors.iconDark,fontSize:30},
  iconD28:{color:Colors.iconDark,fontSize:28},
  iconD26:{color:Colors.iconDark,fontSize:26},
  iconD24:{color:Colors.iconDark,fontSize:24},
  iconD22:{color:Colors.iconDark,fontSize:22},
  iconD20:{color:Colors.iconDark,fontSize:20},
  iconD18:{color:Colors.iconDark,fontSize:18},
  iconM30:{color:Colors.iconMedium,fontSize:30},
  iconM28:{color:Colors.iconMedium,fontSize:28},
  iconM26:{color:Colors.iconMedium,fontSize:26},
  iconM24:{color:Colors.iconMedium,fontSize:24},
  iconM22:{color:Colors.iconMedium,fontSize:22},
  iconM20:{color:Colors.iconMedium,fontSize:20},
  iconM18:{color:Colors.iconMedium,fontSize:18},
  iconL30:{color:Colors.iconLight,fontSize:30},
  iconL28:{color:Colors.iconLight,fontSize:28},
  iconL26:{color:Colors.iconLight,fontSize:26},
  iconL24:{color:Colors.iconLight,fontSize:24},
  iconL22:{color:Colors.iconLight,fontSize:22},
  iconL20:{color:Colors.iconLight,fontSize:20},
  iconL18:{color:Colors.iconLight,fontSize:18},
  // custom icon
  imageD30:{tintColor:Colors.iconDark,width:30,height:30},
  imageD28:{tintColor:Colors.iconDark,width:28,height:28},
  imageD26:{tintColor:Colors.iconDark,width:26,height:26},
  imageD24:{tintColor:Colors.iconDark,width:24,height:24},
  imageD22:{tintColor:Colors.iconDark,width:22,height:22},
  imageD20:{tintColor:Colors.iconDark,width:20,height:20},
  imageD18:{tintColor:Colors.iconDark,width:18,height:18},
  imageM30:{tintColor:Colors.iconMedium,width:30,height:30},
  imageM28:{tintColor:Colors.iconMedium,width:28,height:28},
  imageM26:{tintColor:Colors.iconMedium,width:26,height:26},
  imageM24:{tintColor:Colors.iconMedium,width:24,height:24},
  imageM22:{tintColor:Colors.iconMedium,width:22,height:22},
  imageM20:{tintColor:Colors.iconMedium,width:20,height:20},
  imageM18:{tintColor:Colors.iconMedium,width:18,height:18},
  imageL30:{tintColor:Colors.iconLight,width:30,height:30},
  imageL28:{tintColor:Colors.iconLight,width:28,height:28},
  imageL26:{tintColor:Colors.iconLight,width:26,height:26},
  imageL24:{tintColor:Colors.iconLight,width:24,height:24},
  imageL22:{tintColor:Colors.iconLight,width:22,height:22},
  imageL20:{tintColor:Colors.iconLight,width:20,height:20},
  imageL18:{tintColor:Colors.iconLight,width:18,height:18},
  // badge
  badge:{backgroundColor:Colors.red,position:'absolute',marginTop:badgeMarginTop,tintColor:Colors.white,width:badgeSize,height:badgeSize,borderRadius:badgeSize/2,marginLeft:badgeMarginLeft,alignItems:'center',justifyContent:'center'},
  badgeT:{color:Colors.white,fontSize:12},
  // lines
  lineHD:{backgroundColor:Colors.lineDark,height:lineSize,width:'100%'},
  lineVD:{backgroundColor:Colors.lineDark,height:'100%',width:lineSize},
  lineHM:{backgroundColor:Colors.lineMedium,height:lineSize,width:'100%'},
  lineVM:{backgroundColor:Colors.lineMedium,height:'100%',width:lineSize},
  lineHL:{backgroundColor:Colors.lineLight,height:lineSize,width:'100%'},
  lineVL:{backgroundColor:Colors.lineLight,height:'100%',width:lineSize},
  // texts
  textD22:{color:Colors.textDark,fontSize:22,fontWeight:'normal'},
  textDB22:{color:Colors.textDark,fontSize:22,fontWeight:'bold'},
  textM22:{color:Colors.textMedium,fontSize:22,fontWeight:'normal'},
  textMB22:{color:Colors.textMedium,fontSize:22,fontWeight:'bold'},
  textL22:{color:Colors.textLight,fontSize:22,fontWeight:'normal'},
  textLB22:{color:Colors.textLight,fontSize:22,fontWeight:'bold'},
  textD20:{color:Colors.textDark,fontSize:20,fontWeight:'normal'},
  textDB20:{color:Colors.textDark,fontSize:20,fontWeight:'bold'},
  textM20:{color:Colors.textMedium,fontSize:20,fontWeight:'normal'},
  textMB20:{color:Colors.textMedium,fontSize:20,fontWeight:'bold'},
  textL20:{color:Colors.textLight,fontSize:20,fontWeight:'normal'},
  textLB20:{color:Colors.textLight,fontSize:20,fontWeight:'bold'},
  textD18:{color:Colors.textDark,fontSize:18,fontWeight:'normal'},
  textDB18:{color:Colors.textDark,fontSize:18,fontWeight:'bold'},
  textM18:{color:Colors.textMedium,fontSize:18,fontWeight:'normal'},
  textMB18:{color:Colors.textMedium,fontSize:18,fontWeight:'bold'},
  textL18:{color:Colors.textLight,fontSize:18,fontWeight:'normal'},
  textLB18:{color:Colors.textLight,fontSize:18,fontWeight:'bold'},
  textD16:{color:Colors.textDark,fontSize:16,fontWeight:'normal'},
  textDB16:{color:Colors.textDark,fontSize:16,fontWeight:'bold'},
  textM16:{color:Colors.textMedium,fontSize:16,fontWeight:'normal'},
  textMB16:{color:Colors.textMedium,fontSize:16,fontWeight:'bold'},
  textL16:{color:Colors.textLight,fontSize:16,fontWeight:'normal'},
  textLB16:{color:Colors.textLight,fontSize:16,fontWeight:'bold'},
  textD14:{color:Colors.textDark,fontSize:14,fontWeight:'normal'},
  textDB14:{color:Colors.textDark,fontSize:14,fontWeight:'bold'},
  textM14:{color:Colors.textMedium,fontSize:14,fontWeight:'normal'},
  textMB14:{color:Colors.textMedium,fontSize:14,fontWeight:'bold'},
  textL14:{color:Colors.textLight,fontSize:14,fontWeight:'normal'},
  textLB14:{color:Colors.textLight,fontSize:14,fontWeight:'bold'},
  textD12:{color:Colors.textDark,fontSize:12,fontWeight:'normal'},
  textDB12:{color:Colors.textDark,fontSize:12,fontWeight:'bold'},
  textM12:{color:Colors.textMedium,fontSize:12,fontWeight:'normal'},
  textMB12:{color:Colors.textMedium,fontSize:12,fontWeight:'bold'},
  textL12:{color:Colors.textLight,fontSize:12,fontWeight:'normal'},
  textLB12:{color:Colors.textLight,fontSize:12,fontWeight:'bold'},
  // shadow
  shadow:{shadowOffset:{width:3,height:3},shadowColor:'gray',shadowOpacity:1,elevation:2,zIndex:999},
  // floating button
  floatingButton:{backgroundColor:Colors.button,position:'absolute',alignSelf:'flex-end',margin:floatingButtonMargin,width:floatingButtonSize,height:floatingButtonSize,borderRadius:floatingButtonSize/2,alignItems:'center',justifyContent:'center',shadowOffset:{width:5,height:5},shadowColor:'black',shadowOpacity:1,elevation:3,zIndex:999},
  // checkbox
  checkboxContainerStyle:{backgroundColor:'transparent',borderWidth:0,padding:0},
  checkboxText14:{color:Colors.textDark,marginTop:-2,marginLeft:5,fontWeight:'normal',fontSize:14},
  checkboxText16:{color:Colors.textDark,marginTop:-2,marginLeft:5,fontWeight:'normal',fontSize:16},
  // Rating
  rating:{alignSelf:'flex-start'},
});
