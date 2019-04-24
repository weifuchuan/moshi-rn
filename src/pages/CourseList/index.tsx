import RefreshListView, { RefreshStateType } from '@/components/RefreshListView';
import Touchable from '@/components/Touchable';
import useAnimatedValue from '@/hooks/useAnimatedValue';
import useObject from '@/hooks/useObject';
import { SCREEN_WIDTH } from '@/kit';
import BackableLayout from '@/layouts/BackableLayout';
import Course, { ICourse } from '@/models/Course';
import ThemeContext from '@/themes';
import { action, runInAction } from 'mobx';
import { observer, Observer, useObservable } from 'mobx-react-lite';
import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { RefreshState } from '../../components/RefreshListView';
import { Page } from '../../models/Page';
import CoursePanel from './CoursePanel';

interface Props {
  type: 'column' | 'video';
}

const CourseList: FunctionComponent<Props> = ({ type }) => {
  const state = useObservable<{
    refreshState: RefreshStateType;
    list: ICourse[];
    type: 'column' | 'video';
    orderBy: 'publishAt' | 'subscribedCount' | 'price';
    cending: 'asc' | 'desc';
    nextPageNumber: number;
    lastPage: Page<ICourse> | null;
    headerTop: number;
    showHeader: boolean;
  }>({
    refreshState: RefreshState.Idle,
    list: [],
    type,
    orderBy: 'publishAt',
    cending: 'desc',
    nextPageNumber: 1,
    lastPage: null,
    headerTop: 0,
    showHeader: false
  });
  const theme = useContext(ThemeContext);
  const scrollState = useObject({ offsetY: 0 });
  const animatedHeaderTop = useAnimatedValue(0);
  const show = useCallback(() => {
    state.showHeader = true;
    animationFrame.schedule(() => {
      animatedHeaderTop.setValue(-40);
      Animated.timing(animatedHeaderTop, {
        toValue: 0,
        duration: 500
      }).start();
    });
  }, []);

  const load = useCallback(async () => {
    const page = await Course.list(
      state.type,
      state.orderBy,
      state.cending,
      state.nextPageNumber,
      5
    );
    runInAction(() => {
      if (state.nextPageNumber === 1) {
        state.list.splice(0, state.list.length);
      }
      state.list.push(...page.list);
      if (page.lastPage) {
        state.refreshState = RefreshState.NoMoreData;
      } else {
        state.refreshState = RefreshState.Idle;
      }
      state.lastPage = page;
      state.nextPageNumber++;
    });
  }, []);

  useEffect(() => {
    state.refreshState = RefreshState.HeaderRefreshing;
    load();
  }, []);

  return (
    <BackableLayout title={type === 'column' ? '专栏课程' : '视频课程'}>
      <View style={styles.container}>
        <RefreshListView
          data={state.list
            .filter((x) => !x.subscribed)
            .concat(...state.list.filter((x) => !!x.subscribed))}
          renderItem={({ item }) => {
            return <CoursePanel course={item} />;
          }}
          refreshState={state.refreshState}
          onHeaderRefresh={(rs) => {
            state.refreshState = rs;
            state.nextPageNumber = 1;
            load();
          }}
          ListHeaderComponent={buildHeaderComponent(state, load, theme)}
          keyExtractor={(item) => item.id.toString()}
          onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            if (y >= 80) {
              if (y - scrollState.offsetY < 0 && !state.showHeader) {
                show();
              }
            }
            if (y < 80 || (y - scrollState.offsetY > 0 && state.showHeader)) {
              state.showHeader = false;
            }
            scrollState.offsetY = y;
          }}
          onFooterRefresh={(rs) => {
            state.refreshState = rs;
            if (state.lastPage && state.lastPage.lastPage) {
              state.refreshState = RefreshState.NoMoreData;
            } else {
              load();
            }
          }}
        />
        <Observer>
          {() => (
            <Animated.View
              style={[
                styles.header,
                {
                  top: animatedHeaderTop,
                  position: 'absolute',
                  left: state.showHeader ? 0 : SCREEN_WIDTH
                }
              ]}
            >
              <Touchable
                onPress={action(() => {
                  state.orderBy = 'publishAt';
                  state.cending = 'desc';
                  state.nextPageNumber = 1;
                  state.refreshState = RefreshState.HeaderRefreshing;
                  load();
                })}
              >
                <View style={styles.headerItem}>
                  <Text
                    style={[
                      { fontSize: 16 },
                      state.orderBy === 'publishAt'
                        ? { color: theme.colors.Tomato }
                        : {}
                    ]}
                  >
                    上新
                  </Text>
                </View>
              </Touchable>
              <Touchable
                onPress={action(() => {
                  state.orderBy = 'subscribedCount';
                  state.cending = 'desc';
                  state.nextPageNumber = 1;
                  state.refreshState = RefreshState.HeaderRefreshing;
                  load();
                })}
              >
                <View style={styles.headerItem}>
                  <Text
                    style={[
                      { fontSize: 16 },
                      state.orderBy === 'subscribedCount'
                        ? { color: theme.colors.Tomato }
                        : {}
                    ]}
                  >
                    订阅数
                  </Text>
                </View>
              </Touchable>
              <Touchable
                onPress={action(() => {
                  if (state.orderBy === 'price') {
                    if (state.cending === 'desc') {
                      state.cending = 'asc';
                    } else {
                      state.cending = 'desc';
                    }
                  } else {
                    state.orderBy = 'price';
                    state.cending = 'asc';
                  }
                  state.nextPageNumber = 1;
                  state.refreshState = RefreshState.HeaderRefreshing;
                  load();
                })}
              >
                <View style={styles.headerItem}>
                  <Text
                    style={[
                      { fontSize: 16 },
                      state.orderBy === 'price'
                        ? { color: theme.colors.Tomato }
                        : {}
                    ]}
                  >
                    价格
                  </Text>
                  <UpDown
                    state={
                      state.orderBy === 'price' ? state.cending === 'asc' ? (
                        'up'
                      ) : (
                        'down'
                      ) : (
                        undefined
                      )
                    }
                  />
                </View>
              </Touchable>
            </Animated.View>
          )}
        </Observer>
      </View>
    </BackableLayout>
  );
};

function buildHeaderComponent(
  state: any,
  load: () => Promise<void>,
  theme: any
): any {
  return () => {
    return (
      <Observer>
        {() => (
          <View style={[ styles.header ]}>
            <Touchable
              onPress={action(() => {
                state.orderBy = 'publishAt';
                state.cending = 'desc';
                state.nextPageNumber = 1;
                state.refreshState = RefreshState.HeaderRefreshing;
                load();
              })}
            >
              <View style={styles.headerItem}>
                <Text
                  style={[
                    { fontSize: 16 },
                    state.orderBy === 'publishAt'
                      ? { color: theme.colors.Tomato }
                      : {}
                  ]}
                >
                  上新
                </Text>
              </View>
            </Touchable>
            <Touchable
              onPress={action(() => {
                state.orderBy = 'subscribedCount';
                state.cending = 'desc';
                state.nextPageNumber = 1;
                state.refreshState = RefreshState.HeaderRefreshing;
                load();
              })}
            >
              <View style={styles.headerItem}>
                <Text
                  style={[
                    { fontSize: 16 },
                    state.orderBy === 'subscribedCount'
                      ? { color: theme.colors.Tomato }
                      : {}
                  ]}
                >
                  订阅数
                </Text>
              </View>
            </Touchable>
            <Touchable
              onPress={action(() => {
                if (state.orderBy === 'price') {
                  if (state.cending === 'desc') {
                    state.cending = 'asc';
                  } else {
                    state.cending = 'desc';
                  }
                } else {
                  state.orderBy = 'price';
                  state.cending = 'asc';
                }
                state.nextPageNumber = 1;
                state.refreshState = RefreshState.HeaderRefreshing;
                load();
              })}
            >
              <View style={styles.headerItem}>
                <Text
                  style={[
                    { fontSize: 16 },
                    state.orderBy === 'price'
                      ? { color: theme.colors.Tomato }
                      : {}
                  ]}
                >
                  价格
                </Text>
                <UpDown
                  state={
                    state.orderBy === 'price' ? state.cending === 'asc' ? (
                      'up'
                    ) : (
                      'down'
                    ) : (
                      undefined
                    )
                  }
                />
              </View>
            </Touchable>
          </View>
        )}
      </Observer>
    );
  };
}

function UpDown({ state }: { state: 'up' | 'down' | undefined }) {
  const theme = useContext(ThemeContext);
  return (
    <View style={{ justifyContent: 'center', marginLeft: 4 }}>
      <Foundation
        name={'arrow-up'}
        size={8}
        color={state && state === 'up' ? theme.colors.Tomato : undefined}
      />
      <Foundation
        name={'arrow-down'}
        size={8}
        color={state && state === 'down' ? theme.colors.Tomato : undefined}
      />
    </View>
  );
}

export default observer(CourseList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  } as ViewStyle,
  listHeader: { height: 40 },
  header: {
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40
  } as ViewStyle,
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle
});
