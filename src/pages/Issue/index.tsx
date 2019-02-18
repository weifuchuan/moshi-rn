import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useEffect,
  useContext
} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native';
import { observer, useObservable } from 'mobx-react-lite';
import { IIssue } from '@/models/Issue';
import BackableLayout from '@/layouts/BackableLayout';
import WebView2, { AnyAction } from '@/components/WebView2';
import Touchable from '@/components/Touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IssueModel from '@/models/Issue';
import { StoreContext } from '@/store';
import ThemeContext from '@/themes';
import { Toast } from '@ant-design/react-native';
import Routes from '@/Routes';
import { staticBaseUrl } from '@/kit/req';
import markdownToHtml from '@/kit/functions/markdownToHtml';
import { patchAvatar } from '@/models/Account';
import { SCREEN_HEIGHT } from '@/kit';
import html from './issue.html.raw'

interface Props {
  issue: IIssue;
}

const Issue: FunctionComponent<Props> = observer(({ issue }) => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);

  const state = useObservable({
    issueFetching: false
  });

  const wvRef = useRef<WebView2>(null);

  const onMsg = useCallback(async ({ action, payload }: AnyAction) => {
    switch (action) {
      case '':
        break;

      default:
        break;
    }
  }, []);

  const fetchIssue = useCallback(async () => {
    state.issueFetching = true;
    const id = issue.id;
    try {
      const { issue, comments } = await IssueModel.fetchIssue(id);
      patchAvatar(issue);
      comments.forEach((c) => patchAvatar(c));
      const htmlPromises = comments.map((c) => markdownToHtml(c.content));
      const htmls = await Promise.all(htmlPromises);
      htmls.forEach((html, i) => (comments[i].content = html));
      wvRef.current!.post({ action: 'load', payload: { issue, comments } });
    } catch (error) {
      Toast.fail(error);
      Routes.pop();
    }
    state.issueFetching = false;
  }, []);

  useEffect(() => {
    fetchIssue();
  }, []);

  return (
    <BackableLayout
      title={'issue'}
      right={
        <Touchable
          onPress={() => {
            Routes.issueComment(issue, (comment) => {
              Routes.pop();
              fetchIssue();
            });
          }}
        >
          <Ionicons size={24} name={'ios-create'} />
        </Touchable>
      }
    >
      <View style={styles.container}>
        <WebView2
          source={
          //  { uri: 'http://192.168.1.18:3001/issue.html' }
          {html,baseUrl:""}
          }
          on={onMsg}
          ref={wvRef}
          originWhitelist={[]}
          notAutoHeight={true}
          style={{ flex: 1 }}
        />
        {/* <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={state.issueFetching}
              onRefresh={() => fetchIssue()}
            />
          }
        >
          <View>
            <WebView2
              source={{ uri: 'http://192.168.1.18:3001/issue.html' }}
              on={onMsg}
              ref={wvRef}
              originWhitelist={[]}   
            />
          </View>
        </ScrollView> */}
      </View>
    </BackableLayout>
  );
});

export default Issue;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' } as ViewStyle
});
