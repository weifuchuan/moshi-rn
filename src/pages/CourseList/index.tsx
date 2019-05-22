import Touchable from '@/components/Touchable';
import useAnimatedValue from '@/hooks/useAnimatedValue';
import useObject from '@/hooks/useObject';
import { SCREEN_WIDTH } from '@/kit';
import BackableLayout from '@/layouts/BackableLayout';
import Course, { ICourse } from '@/models/Course';
import ThemeContext from '@/themes';
import { action, runInAction } from 'mobx';
import { observer, Observer, useLocalStore } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect
} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ScrollView
} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import RefreshListView, { RefreshState } from '@/components/RefreshListView';
import { Page } from '@/models/Page';
import CoursePanel from './CoursePanel';
import { Drawer, SearchBar } from '@ant-design/react-native';
import { _ICourseType } from '@/models/_db';
import _ from 'lodash';
import MultiSelector from './MultiSelector';

interface Props {
  type: 'column' | 'video';
}

const CourseList: FunctionComponent<Props> = ({ type }) => {
  const state = useLocalStore(() => ({
    refreshState: RefreshState.Idle,
    list: [] as ICourse[],
    type: type as 'column' | 'video',
    orderBy: 'publishAt' as 'publishAt' | 'subscribedCount' | 'price',
    cending: 'desc' as 'asc' | 'desc',
    nextPageNumber: 1,
    lastPage: null as Page<ICourse> | null,
    headerTop: 0,
    showHeader: false,
    openSearchDrawer: false,
    searchText: '',
    searching: false,
    courseTypeList: [] as _ICourseType[],
    get courseTypeNameList() {
      return _.uniq(this.courseTypeList.map((x) => x.typeName));
    },
    selectedTypeList: [] as string[]
  }));
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

  const search = useCallback(
    action(async () => {
      const q = state.searchText.trim();
      if (!q) {
        noSearch();
        return;
      }
      state.refreshState = RefreshState.HeaderRefreshing;
      state.searching = true;
      try {
        const list = await Course.search(q);
        state.list = list;
      } catch (e) {
      } finally {
        state.refreshState = RefreshState.Idle;
      }
    }),
    []
  );

  const noSearch = useCallback(
    action(() => {
      state.searching = false;
      state.searchText = '';
      state.refreshState = RefreshState.HeaderRefreshing;
      state.nextPageNumber = 1;
      load();
    }),
    []
  );

  const loadByType = useCallback(async () => {
    state.openSearchDrawer = false;
    if (state.selectedTypeList.length === 0) {
      noSearch();
      return;
    }
    state.refreshState = RefreshState.HeaderRefreshing;
    state.searching = true;
    try {
      const list = await Course.courseListByIdList(
        _.uniq(
          state.courseTypeList
            .filter(
              (x) =>
                state.selectedTypeList.findIndex((s) => s === x.typeName) !== -1
            )
            .map((x) => x.courseId)
        )
      );
      state.list = list;
    } catch (e) {
    } finally {
      state.refreshState = RefreshState.Idle;
    }
  }, []);

  useEffect(() => {
    state.refreshState = RefreshState.HeaderRefreshing;
    load();
    Course.allCourseType().then((list) => {
      state.courseTypeList = list;
    });
  }, []);

  return (
    <Drawer
      open={state.openSearchDrawer}
      onOpenChange={(open) => (state.openSearchDrawer = open)}
      position="right"
      drawerBackgroundColor={'white'}
      sidebar={
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <MultiSelector
              options={state.courseTypeNameList}
              selected={state.selectedTypeList}
              onChange={(selected) => (state.selectedTypeList = selected)}
            />
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <Touchable
              onPress={() => ((state.selectedTypeList = []), loadByType())}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.橙红色,
                  height: 48
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    backgroundColor: colors.橙红色,
                    fontSize: 20
                  }}
                >
                  清空
                </Text>
              </View>
            </Touchable>
            <Touchable onPress={loadByType}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.森林绿,
                  height: 48
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    backgroundColor: colors.森林绿,
                    fontSize: 20
                  }}
                >
                  确定
                </Text>
              </View>
            </Touchable>
          </View>
        </View>
      }
    >
      <BackableLayout
        title={type === 'column' ? '专栏课程' : '视频课程'}
        right={<Text onPress={() => (state.openSearchDrawer = true)}>分类</Text>}
      >
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
              if (state.searching) return;
              state.refreshState = rs;
              state.nextPageNumber = 1;
              load();
            }}
            ListHeaderComponent={() => {
              return (
                <Observer>
                  {() => (
                    <View style={{ backgroundColor: '#ffffff' }}>
                      {state.searching ? null : (
                        <View style={[ styles.header ]}>
                          <Touchable
                            onPress={action(() => {
                              state.orderBy = 'publishAt';
                              state.cending = 'desc';
                              state.nextPageNumber = 1;
                              state.refreshState =
                                RefreshState.HeaderRefreshing;
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
                              state.refreshState =
                                RefreshState.HeaderRefreshing;
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
                              state.refreshState =
                                RefreshState.HeaderRefreshing;
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
                                  state.orderBy === 'price' ? state.cending ===
                                  'asc' ? (
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
                      <View style={{ backgroundColor: '#ffffff' }}>
                        <SearchBar
                          style={{ backgroundColor: '#ffffff' }}
                          onSubmit={search}
                          value={state.searchText}
                          onChange={(t) => {
                            state.searchText = t;
                          }}
                          onCancel={noSearch}
                          onClear={noSearch}
                        />
                      </View>
                    </View>
                  )}
                </Observer>
              );
            }}
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
              if (state.searching) return;
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
    </Drawer>
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
