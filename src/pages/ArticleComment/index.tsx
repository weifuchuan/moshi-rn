import React, {
  FunctionComponent,
  useRef,
  useCallback,
  useEffect
} from 'react';
import { View, StyleSheet, ViewStyle, Text, BackHandler } from 'react-native';
import { observer } from 'mobx-react-lite';
import BackableLayout from '@/layouts/BackableLayout';
import MoshiWebView, { AnyAction } from '@/components/MoshiWebView';
import {
  IArticle,
  ArticleComment as ArticleCommentModel
} from '@/models/Article';
import html from './article-comment-editor.html.raw';
import { NavigationScreenProp } from 'react-navigation';
import Routes from '@/Routes';
import useObject from '@/hooks/useObject';
import { Toast, Portal } from '@ant-design/react-native';
import { IArticleComment } from '../../models/Article';

interface Props {
  article: IArticle;
  onCommentSuccess: (comment: IArticleComment) => void;
  navigation: NavigationScreenProp<any>;
}

const ArticleComment: FunctionComponent<
  Props
> = observer(({ article, navigation, onCommentSuccess }) => {
  const wv = useRef<MoshiWebView>(null);
  const lastCtn = useObject({ value: '' });

  const onMsg = useCallback(async ({ action, payload }: AnyAction) => {
    switch (action) {
      case 'submit':
        const toastKey = Toast.loading('处理中..', 0);
        try {
          const comment = await ArticleCommentModel.comment(
            article.id,
            payload
          );
          Portal.remove(toastKey);
          Toast.success('评论成功');
          onCommentSuccess(comment);
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
    <BackableLayout title="留言" onBack={onBack}>
      <MoshiWebView
        ref={wv}
        source={
          //{ uri: 'http://192.168.1.18:3001/article-comment-editor.html' }
         { html, baseUrl: '' }
        }
        on={onMsg}
      />
    </BackableLayout>
  );
});

export default ArticleComment;

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
