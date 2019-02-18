import React, {
  FunctionComponent,
  useRef,
  useCallback,
  useEffect,
  useContext
} from 'react';
import { View, StyleSheet, ViewStyle, Text, BackHandler } from 'react-native';
import { observer } from 'mobx-react-lite';
import BackableLayout from '@/layouts/BackableLayout';
import WebView2, { AnyAction } from '@/components/WebView2';
import html from './article-comment-editor.html.raw';
import { NavigationScreenProp } from 'react-navigation';
import Routes from '@/Routes';
import useObject from '@/hooks/useObject';
import { Toast, Portal } from '@ant-design/react-native';
import Issue, { IIssue, IIssueComment } from '@/models/Issue';
import { StoreContext } from '@/store';
import ThemeContext from '@/themes';

interface Props {
  issue: IIssue;
  onCommentSuccess: (comment: IIssueComment) => void;
  navigation: NavigationScreenProp<any>;
}

const IssueComment: FunctionComponent<
  Props
> = observer(({ issue, navigation, onCommentSuccess }) => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);
  const wv = useRef<WebView2>(null);
  const lastCtn = useObject({ value: '' });

  const onMsg = useCallback(async ({ action, payload }: AnyAction) => {
    switch (action) {
      case 'submit':
        const toastKey = Toast.loading('处理中..', 0);
        try {
          const { id, createAt } = await Issue.comment(issue.id, payload);
          Portal.remove(toastKey);
          Toast.success('评论成功');
          onCommentSuccess({
            id,
            issueId: issue.id,
            accountId: store.me!.id,
            createAt,
            content: payload,
            status: 0,
            nickName: store.me!.nickName,
            avatar: store.me!.avatar
          });
        } catch (err) {
          Portal.remove(toastKey);
          Toast.fail(err);
        }
        storage.remove({ key: 'lastCommentContent' }).catch((err) => null);
        break;
      case 'editorReady':
        wv.current!.post({ action: 'setContent', payload: lastCtn.value });
        break;
      default:
        break;
    }
  }, []);

  const onBack = useCallback(async () => {
    try {
      const content = await wv.current!.post({ action: 'getContent' });
      await storage.save({
        key: 'lastCommentContent',
        data: content
      });
    } catch (err) {
      console.warn(err.toString());
    }
    Routes.pop();
  }, []);

  useEffect(() => {
    storage
      .load({ key: 'lastCommentContent' })
      .then((ctn) => (lastCtn.value = ctn))
      .catch((err) => null);
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBack
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <BackableLayout title="评论" onBack={onBack}>
      <WebView2
        ref={wv}
        source={//{ uri: 'http://192.168.1.18:3001/article-comment-editor.html' }
        { html, baseUrl: '' }}
        on={onMsg}
      />
    </BackableLayout>
  );
});

export default IssueComment;

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
