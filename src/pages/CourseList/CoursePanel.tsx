import React, {FunctionComponent, useContext} from 'react';
import {
	View,
	StyleSheet,
	ViewStyle,
	Text,
	Image,
	ImageStyle
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {ICourse, defaultRealPicture} from '@/models/Course';
import {staticBaseUrl} from '@/kit/req';
import Touchable from '@/components/Touchable';
import Routes from '@/Routes';
import isUndefOrNull from '@/kit/functions/isUndefOrNull';
import Entypo from 'react-native-vector-icons/Entypo';
import ThemeContext from '@/themes';

interface Props {
	course: ICourse;
}

const CoursesPanel: FunctionComponent<Props> = ({course}) => {
	const theme = useContext(ThemeContext);
	let avatarUri = course.realPicture || course.avatar || defaultRealPicture;
	if (__DEV__ && !avatarUri.startsWith('data:')) {
		avatarUri = staticBaseUrl + avatarUri;
	}
	return (
		<Touchable
			key={course.id}
			onPress={() => {
				if (course.subscribed) {
					Routes.course(course);
				} else
					Routes.courseIntro(course);
			}}
		>
			<View style={styles.item}>
				<View>
					<Image
						resizeMode="stretch"
						source={{uri: avatarUri}}
						style={styles.avatar}
					/>
				</View>
				<View style={styles.info}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: '#000'
							}}
						>
							{course.name}
						</Text>
						<Entypo name={'chevron-thin-right'} size={16}/>
					</View>
					<View style={{flex: 1, justifyContent: 'space-evenly'}}>
						<View>
							<Text style={{fontSize: 12}}>
								{course.lectureCount}讲 | {course.shortIntro}
							</Text>
						</View>
						<View>
							<Text style={{fontSize: 12}}>{course.nickName}</Text>
						</View>
					</View>
					<View style={styles.priceBar}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							{course.subscribed ? (
								<Text style={{fontSize: 14, fontWeight: 'bold'}}>已订阅</Text>
							) : (
								<React.Fragment>
									{!isUndefOrNull(course.discountedPrice) &&
									course.offerTo &&
									course.offerTo > Date.now() ? (
										<React.Fragment>
											<Text
												style={{
													color: theme.colors.Crimson,
													fontSize: 10,
													paddingVertical: 0,
													paddingHorizontal: 2,
													borderColor: theme.colors.Crimson,
													textAlign: 'center',
													textAlignVertical: 'center',
													borderWidth: 1,
													borderRadius: 5
												}}
											>
												限时
											</Text>
										</React.Fragment>
									) : null}
									<Text
										style={{
											color: theme.colors.Tomato,
											fontSize: 16,
											marginLeft:
												!isUndefOrNull(course.discountedPrice) &&
												course.offerTo &&
												course.offerTo > Date.now()
													? 5
													: 0
										}}
									>
										￥{!isUndefOrNull(course.discountedPrice) &&
									course.offerTo &&
									course.offerTo > Date.now() ? (
										course.discountedPrice
									) : (
										course.price
									)}
									</Text>
									{!isUndefOrNull(course.discountedPrice) &&
									course.offerTo &&
									course.offerTo > Date.now() ? (
										<React.Fragment>
											<Text
												style={{
													textDecorationLine: 'line-through',
													color: '#778899',
													fontSize: 12,
													marginLeft: 5
												}}
											>
												￥{course.price}
											</Text>
										</React.Fragment>
									) : null}
								</React.Fragment>
							)}
						</View>
						<Text style={{fontSize: 12}}>{course.buyerCount}人已学习</Text>
					</View>
				</View>
			</View>
		</Touchable>
	);
};

export default observer(CoursesPanel);

const styles = StyleSheet.create({
	item: {
		padding: 8,
		flexDirection: 'row'
	} as ViewStyle,
	avatar: {
		width: 80,
		height: 80 / 2.5 * 3.5,
		borderRadius: 20
	} as ImageStyle,
	info: {
		flex: 1,
		marginLeft: 8
	} as ViewStyle,
	priceBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	} as ViewStyle
});
