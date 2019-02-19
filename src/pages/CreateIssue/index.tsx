import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useRef,
  useContext
} from 'react';
import { View, StyleSheet, ViewStyle, Text, BackHandler } from 'react-native';
import { observer } from 'mobx-react-lite';
import Issue from '@/models/Issue';
import { ICourse } from '@/models/Course';
import BackableLayout from '@/layouts/BackableLayout';
import MoshiWebView, { AnyAction } from '@/components/MoshiWebView';
import { Toast, Portal } from '@ant-design/react-native';
import useObject from '@/hooks/useObject';
import Routes from '@/Routes';
import { StoreContext } from '@/store';
import html from './issue-editor.html.raw';

interface Props {
  course: ICourse;
  onSuccess: (issue: Issue) => void;
}

const CreateIssue: FunctionComponent<
  Props
> = observer(({ course, onSuccess }) => {
  const store = useContext(StoreContext);
  const wv = useRef<MoshiWebView>(null);

  const onMsg = useCallback(async ({ action, payload }: AnyAction) => {
    switch (action) {
      case 'submit':
        const toastKey = Toast.loading('处理中..', 0);
        try {
          const { title, content } = payload;
          const { id, openAt } = await Issue.create(course.id, title, content);
          Portal.remove(toastKey);
          Toast.success('评论成功');
          onSuccess(
            Issue.from({
              id,
              courseId: course.id,
              accountId: store.me!.id,
              title,
              openAt,
              status: Issue.STATUS.OPEN,
              nickName: store.me!.nickName,
              avatar: store.me!.avatar,
              commentCount: 0
            })
          );
        } catch (err) {
          Portal.remove(toastKey);
          Toast.fail(err);
        }
        storage.remove({ key: 'lastIssueTitleContent' }).catch((err) => null);
        break;
      case 'editorReady':
        storage
          .load({ key: 'lastIssueTitleContent' })
          .then(({ title, content }) => {
            wv.current!.post({
              action: 'setTitleContent',
              payload: { title, content }
            });
          })
          .catch((err) => null);
        break;
      default:
        break;
    }
  }, []);

  const onBack = useCallback(async () => {
    try {
      const { title, content } = await wv.current!.post({
        action: 'getTitleContent'
      });
      await storage.save({
        key: 'lastIssueTitleContent',
        data: { title, content }
      });
    } catch (err) {
      console.warn(err.toString());
    }
    Routes.pop();
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBack
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <BackableLayout title="Create Issue">
      <MoshiWebView
        ref={wv}
        source={//{ uri: 'http://192.168.1.18:3001/issue-editor.html' }
        { html, baseUrl: '' }}
        on={onMsg}
      />
    </BackableLayout>
  );
});

export default CreateIssue;

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
