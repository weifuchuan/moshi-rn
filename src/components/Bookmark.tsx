import React from 'react';
import { View, ImageBackground, Text, Image } from 'react-native';

export default function Bookmark({ word }: { word: string }) {
  return (
    <View>
      <ImageBackground
        source={{ uri: bookmark }}
        style={{ width: '100%', height: word.length*13 }}
        imageStyle={{ tintColor: colors.Tomato }}
        resizeMode="stretch"
      >
        <View style={{ paddingVertical: 2, }}>
          {word.split('').map((ch, i) => (
            <Text
              key={ch + i}
              style={{
                color: '#fff',
                fontSize: 12,
                margin: 0,
                padding: 0,
                lineHeight: 13
              }}
            >
              {ch}
            </Text>
          ))}
        </View>
      </ImageBackground>
      <ImageBackground
        source={{ uri: bottom }}
        style={{ width: '100%', height: 10 }}
        imageStyle={{ tintColor: colors.Tomato }}
        resizeMode="stretch"
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 8,
            margin: 0,
            padding: 0,
            lineHeight: 10
          }}
        >
          {' '}
        </Text>
      </ImageBackground>
    </View>
  );
}

const bookmark =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABlCAYAAADu36WvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADhSURBVHhe7dCxDcAwEAOxT/bf2U6R1r4FSEBQf8/MrG8cvP9zIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAgUBAoCBYGCQEGgIFAQKAh0NbMBBk4Bybt8DcUAAAAASUVORK5CYII=';

const bottom =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAkCAYAAAAq23xmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEwSURBVGhD7ZNZisMwEAWdOXly8kwMfpDJlB0t3a32UlBYeuirwLdpmp4vL1b4Wb4XK2QL9FhMxfyLZfD+UsxnejNCHKN9jyOyRMIxUoojMkTCMcqtOGJ0JBwjLIkjRkbC0duaOGJUJBw9bYkjRkTC0cueOCI6Eo4eWsQRkZFwtNYyjoiKhKOlHnFERCQcrfSMI7wj4WhhRBzhGQnHXiPjCK9IOPY4Io7wiIRjqyPjCOtIOLaYIY6wjIRjrZniCKtIONaYMY6wiIRjqZnjiN5IOJa4hziiJxKO39xTHNEaCcct9xhHtETCcc09xxG1kXAkjxBH1ETC8dMjxRGlkXB894hxREkkHOWR44hvkXCcPUMcsRUJxzPFEWuR/g1njCMo0p/LmeOIz0hXHGCJND1/ASxNwp9WazBXAAAAAElFTkSuQmCC';
