// Kotori learning content data. Loaded before app.js.

const dailyTasks=[
 {id:'kana',icon:'🔤',title:'五十音暖身',time:'4 分鐘',page:'kanaPage',desc:'複習幾個平假名或片假名'},
 {id:'vocab',icon:'🌳',title:'單字練習',time:'5 分鐘',page:'vocabPage',desc:'認讀生活常用詞彙'},
 {id:'grammar',icon:'🏫',title:'文法小課',time:'7 分鐘',page:'grammarPage',desc:'理解一個句型和例句'},
 {id:'review',icon:'🧠',title:'記憶補給站',time:'4 分鐘',page:'reviewPage',desc:'重溫標記為不熟悉的內容'},
 {id:'story',icon:'☕',title:'情境對話',time:'5 分鐘',page:'story',desc:'嘗試用日文回應角色'},
 {id:'comic',icon:'📚',title:'漫畫閱讀',time:'5 分鐘',page:'comic',desc:'閱讀一句原創日文短篇'}
];

const learningAreas=[
 {id:'kana',icon:'🌷',name:'五十音花園',en:'Kana Village',desc:'認識平假名、片假名和日語發音。',tone:'kana',lessonPage:'kanaPage',challenge:'五十音測驗',chapters:[['假名初相識','認識平假名與片假名'],['發音小徑','鞏固讀音與常見組合'],['五十音試煉','檢查假名認讀能力']]},
 {id:'vocab',icon:'🌳',name:'單字森林',en:'Vocabulary Forest',desc:'從校園及日常生活開始，累積真正用得上的詞彙。',tone:'vocab',lessonPage:'vocabPage',challenge:'單字挑戰',chapters:[['校園與日常','學習身邊常見的人事物'],['動作與表達','認識常用動詞及生活表達'],['詞彙綜合挑戰','在不同情境中辨認單字']]},
 {id:'grammar',icon:'🏫',name:'文法學院',en:'Grammar Academy',desc:'由基本句型開始，逐步學會組織自然的日文句子。',tone:'grammar',lessonPage:'grammarPage',challenge:'句型練習',chapters:[['建立第一個句子','認識主題及基本判斷句'],['句子變化','學習否定、動作及場所表達'],['助詞與應用','理解助詞並組合句子']]},
 {id:'conversation',icon:'☕',name:'對話咖啡店',en:'Conversation Café',desc:'練習打招呼、自我介紹和校園日常交流。',tone:'conversation',lessonPage:'story',challenge:'情境對話',chapters:[['初次見面','打招呼及自我介紹'],['校園日常','談論喜好和日常活動'],['成為朋友','在情境中自然回應']]},
 {id:'manga',icon:'📚',name:'漫畫圖書館',en:'Manga Library',desc:'透過短篇內容練習閱讀、理解和日語表達。',tone:'manga',lessonPage:'comic',challenge:'閱讀理解',chapters:[['讀懂短對話','從短句理解人物意思'],['故事與情境','結合上下文理解內容'],['漫畫閱讀挑戰','整理故事重點及用語']]},
 {id:'jlpt',icon:'🏰',name:'JLPT 試煉塔',en:'JLPT Tower',desc:'整理 N5 基礎，逐步銜接 N4 學習內容。',tone:'jlpt',lessonPage:'jlpt',challenge:'能力檢視',chapters:[['N5 基礎','假名、詞彙及基本句型'],['N5 綜合','整合閱讀、文法及詞彙'],['N4 預備','為進階句型及閱讀作準備']]}
];
const questions=[
 {jp:'こんにちは',reading:'こんにちは',meaning:'你好／午安',opts:['早上好','你好','晚安','謝謝'],answer:1,why:'こんにちは 是白天見面時常用的問候語。'},
 {jp:'わたしは学生です。',reading:'わたしは がくせい です。',meaning:'我是學生。',opts:['我是老師。','我是學生。','我是日本人。','我不是學生。'],answer:1,why:'わたし 是「我」，学生（がくせい）是「學生」，です 是禮貌句尾。'},
 {jp:'水を飲みます。',reading:'みずを のみます。',meaning:'喝水。',opts:['吃飯。','喝茶。','喝水。','買水。'],answer:2,why:'水（みず）是水，飲みます（のみます）是喝。'}
];
const hiragana=[['あ','a','あさ（早上）'],['い','i','いぬ（狗）'],['う','u','うみ（海）'],['え','e','えき（車站）'],['お','o','おに（鬼）'],['か','ka','かさ（雨傘）'],['き','ki','きつね（狐狸）'],['く','ku','くつ（鞋）'],['け','ke','けさ（今天早上）'],['こ','ko','こえ（聲音）'],['さ','sa','さくら（櫻花）'],['し','shi','しお（鹽）'],['す','su','すし（壽司）'],['せ','se','せんせい（老師）'],['そ','so','そら（天空）'],['た','ta','たこ（章魚）'],['ち','chi','ちず（地圖）'],['つ','tsu','つき（月亮）'],['て','te','て（手）'],['と','to','とけい（時鐘）'],['な','na','なつ（夏天）'],['に','ni','にく（肉）'],['ぬ','nu','ぬの（布）'],['ね','ne','ねこ（貓）'],['の','no','のみもの（飲品）'],['は','ha','はな（花）'],['ひ','hi','ひと（人）'],['ふ','fu','ふね（船）'],['へ','he','へや（房間）'],['ほ','ho','ほし（星星）'],['ま','ma','まち（城鎮）'],['み','mi','みず（水）'],['む','mu','むし（昆蟲）'],['め','me','め（眼睛）'],['も','mo','もも（桃）'],['や','ya','やま（山）'],['ゆ','yu','ゆき（雪）'],['よ','yo','よる（晚上）'],['ら','ra','らいねん（明年）'],['り','ri','りんご（蘋果）'],['る','ru','さる（猴子）'],['れ','re','れい（例子）'],['ろ','ro','ろく（六）'],['わ','wa','わたし（我）'],['を','o','助詞を'],['ん','n','ほん（書）']];
const katakana=[['ア','a','アニメ（動畫）'],['イ','i','インク（墨水）'],['ウ','u','ウール（羊毛）'],['エ','e','エア（空氣）'],['オ','o','オレンジ（橙）'],['カ','ka','カメラ（相機）'],['キ','ki','キウイ（奇異果）'],['ク','ku','クラス（班級）'],['ケ','ke','ケーキ（蛋糕）'],['コ','ko','コーヒー（咖啡）'],['サ','sa','サラダ（沙律）'],['シ','shi','シャツ（恤衫）'],['ス','su','スープ（湯）'],['セ','se','セーター（毛衣）'],['ソ','so','ソファ（梳化）'],['タ','ta','タクシー（的士）'],['チ','chi','チーズ（芝士）'],['ツ','tsu','ツアー（旅行團）'],['テ','te','テレビ（電視）'],['ト','to','トマト（番茄）'],['ナ','na','ナイフ（餐刀）'],['ニ','ni','ニュース（新聞）'],['ヌ','nu','カタカナのヌ'],['ネ','ne','ネクタイ（領帶）'],['ノ','no','ノート（筆記簿）'],['ハ','ha','ハンカチ（手帕）'],['ヒ','hi','ヒント（提示）'],['フ','fu','フォーク（叉）'],['ヘ','he','ヘルプ（幫助）'],['ホ','ho','ホテル（酒店）'],['マ','ma','マスク（口罩）'],['ミ','mi','ミルク（牛奶）'],['ム','mu','ムービー（電影）'],['メ','me','メール（電郵）'],['モ','mo','モデル（模特兒）'],['ヤ','ya','ヤギ（山羊）'],['ユ','yu','ユニフォーム（制服）'],['ヨ','yo','ヨーグルト（乳酪）'],['ラ','ra','ラジオ（收音機）'],['リ','ri','リモコン（遙控器）'],['ル','ru','ルール（規則）'],['レ','re','レモン（檸檬）'],['ロ','ro','ロボット（機械人）'],['ワ','wa','ワイン（葡萄汁等語境）'],['ヲ','o','主要作助詞使用'],['ン','n','パン（麵包）']];
const vocabCards=[
 ['学校','がっこう','學校'],['友達','ともだち','朋友'],['食べます','たべます','吃'],['飲みます','のみます','喝'],['今日','きょう','今天'],['明日','あした','明天'],['駅','えき','車站'],['本','ほん','書'],['猫','ねこ','貓'],['時間','じかん','時間'],
 ['先生','せんせい','老師'],['学生','がくせい','學生'],['日本','にほん','日本'],['家','いえ','家'],['車','くるま','汽車'],['電車','でんしゃ','電車'],['学校へ行きます','がっこうへいきます','去學校'],['大きい','おおきい','大／大型'],['小さい','ちいさい','小／細小'],['新しい','あたらしい','新'],
 ['好き','すき','喜歡'],['見る','みる','看'],['聞く','きく','聽／問'],['読む','よむ','讀'],['買う','かう','買'],['高い','たかい','高／貴'],['安い','やすい','便宜'],['おいしい','おいしい','好吃'],['毎日','まいにち','每天'],['午前','ごぜん','上午']
];
const vocab25Cards=[
 // 日常生活會話 10
 {jp:'起きる',reading:'おきる',meaning:'起床',category:'日常生活',example:'毎朝七時に起きます。',exampleReading:'まいあさ しちじに おきます。',exampleMeaning:'我每天早上七點起床。'},
 {jp:'寝る',reading:'ねる',meaning:'睡覺',category:'日常生活',example:'十一時に寝ます。',exampleReading:'じゅういちじに ねます。',exampleMeaning:'我十一點睡覺。'},
 {jp:'朝ご飯',reading:'あさごはん',meaning:'早餐',category:'日常生活',example:'朝ご飯を食べます。',exampleReading:'あさごはんを たべます。',exampleMeaning:'我吃早餐。'},
 {jp:'昼ご飯',reading:'ひるごはん',meaning:'午餐',category:'日常生活',example:'友達と昼ご飯を食べます。',exampleReading:'ともだちと ひるごはんを たべます。',exampleMeaning:'我和朋友吃午餐。'},
 {jp:'晩ご飯',reading:'ばんごはん',meaning:'晚餐',category:'日常生活',example:'晩ご飯はカレーです。',exampleReading:'ばんごはんは カレーです。',exampleMeaning:'晚餐是咖喱。'},
 {jp:'忙しい',reading:'いそがしい',meaning:'忙碌',category:'日常生活',example:'今日は少し忙しいです。',exampleReading:'きょうは すこし いそがしいです。',exampleMeaning:'今天有點忙。'},
 {jp:'休む',reading:'やすむ',meaning:'休息；請假',category:'日常生活',example:'日曜日は家で休みます。',exampleReading:'にちようびは いえで やすみます。',exampleMeaning:'星期日我在家休息。'},
 {jp:'待つ',reading:'まつ',meaning:'等待',category:'日常生活',example:'駅で友達を待ちます。',exampleReading:'えきで ともだちを まちます。',exampleMeaning:'我在車站等朋友。'},
 {jp:'手伝う',reading:'てつだう',meaning:'幫忙',category:'日常生活',example:'母を手伝います。',exampleReading:'ははを てつだいます。',exampleMeaning:'我幫媽媽。'},
 {jp:'一緒に',reading:'いっしょに',meaning:'一起',category:'日常生活',example:'一緒に学校へ行きましょう。',exampleReading:'いっしょに がっこうへ いきましょう。',exampleMeaning:'一起去學校吧。'},
 // 動漫及漫畫常見用語 10
 {jp:'本当',reading:'ほんとう',meaning:'真的；真相',category:'動漫漫畫',example:'本当ですか。',exampleReading:'ほんとうですか。',exampleMeaning:'真的嗎？'},
 {jp:'名前',reading:'なまえ',meaning:'名字',category:'動漫漫畫',example:'あなたの名前は何ですか。',exampleReading:'あなたの なまえは なんですか。',exampleMeaning:'你的名字是甚麼？'},
 {jp:'みんな',reading:'みんな',meaning:'大家；所有人',category:'動漫漫畫',example:'みんなで行きましょう。',exampleReading:'みんなで いきましょう。',exampleMeaning:'大家一起去吧。'},
 {jp:'一人',reading:'ひとり',meaning:'一個人',category:'動漫漫畫',example:'一人で学校へ行きます。',exampleReading:'ひとりで がっこうへ いきます。',exampleMeaning:'我一個人去學校。'},
 {jp:'何',reading:'なに／なん',meaning:'甚麼',category:'動漫漫畫',example:'これは何ですか。',exampleReading:'これは なんですか。',exampleMeaning:'這是甚麼？'},
 {jp:'どうして',reading:'どうして',meaning:'為甚麼',category:'動漫漫畫',example:'どうして笑っていますか。',exampleReading:'どうして わらっていますか。',exampleMeaning:'你為甚麼在笑？'},
 {jp:'ありがとう',reading:'ありがとう',meaning:'謝謝',category:'動漫漫畫',example:'助けてくれてありがとう。',exampleReading:'たすけてくれて ありがとう。',exampleMeaning:'謝謝你幫忙。'},
 {jp:'ごめん',reading:'ごめん',meaning:'對不起（較隨意）',category:'動漫漫畫',example:'遅れてごめん。',exampleReading:'おくれて ごめん。',exampleMeaning:'對不起，我遲到了。'},
 {jp:'かわいい',reading:'かわいい',meaning:'可愛',category:'動漫漫畫',example:'この猫はかわいいです。',exampleReading:'この ねこは かわいいです。',exampleMeaning:'這隻貓很可愛。'},
 {jp:'面白い',reading:'おもしろい',meaning:'有趣',category:'動漫漫畫',example:'この漫画は面白いです。',exampleReading:'この まんがは おもしろいです。',exampleMeaning:'這本漫畫很有趣。'},
 // JLPT N5 常見詞彙 10
 {jp:'家族',reading:'かぞく',meaning:'家人；家庭',category:'JLPT N5',example:'家族は四人です。',exampleReading:'かぞくは よにんです。',exampleMeaning:'我家有四個人。'},
 {jp:'天気',reading:'てんき',meaning:'天氣',category:'JLPT N5',example:'今日の天気はいいです。',exampleReading:'きょうの てんきは いいです。',exampleMeaning:'今天天氣很好。'},
 {jp:'有名',reading:'ゆうめい',meaning:'有名',category:'JLPT N5',example:'この町は有名です。',exampleReading:'この まちは ゆうめいです。',exampleMeaning:'這個城鎮很有名。'},
 {jp:'便利',reading:'べんり',meaning:'方便',category:'JLPT N5',example:'この辞書は便利です。',exampleReading:'この じしょは べんりです。',exampleMeaning:'這本字典很方便。'},
 {jp:'近い',reading:'ちかい',meaning:'近',category:'JLPT N5',example:'駅はここから近いです。',exampleReading:'えきは ここから ちかいです。',exampleMeaning:'車站離這裏很近。'},
 {jp:'遠い',reading:'とおい',meaning:'遠',category:'JLPT N5',example:'学校は少し遠いです。',exampleReading:'がっこうは すこし とおいです。',exampleMeaning:'學校有點遠。'},
 {jp:'早い',reading:'はやい',meaning:'早；快',category:'JLPT N5',example:'今日は早く起きました。',exampleReading:'きょうは はやく おきました。',exampleMeaning:'我今天很早起床。'},
 {jp:'遅い',reading:'おそい',meaning:'遲；慢',category:'JLPT N5',example:'バスは少し遅いです。',exampleReading:'バスは すこし おそいです。',exampleMeaning:'巴士有點遲。'},
 {jp:'勉強',reading:'べんきょう',meaning:'學習；溫習',category:'JLPT N5',example:'毎日日本語を勉強します。',exampleReading:'まいにち にほんごを べんきょうします。',exampleMeaning:'我每天學習日文。'},
 {jp:'旅行',reading:'りょこう',meaning:'旅行',category:'JLPT N5',example:'夏休みに旅行します。',exampleReading:'なつやすみに りょこうします。',exampleMeaning:'暑假去旅行。'}
];

const grammarCards=[['A は B です','わたしは学生です。','我是學生。','は 標示句子的主題；です 是禮貌句尾。'],['A は B じゃありません','わたしは先生じゃありません。','我不是老師。','じゃありません 用來作禮貌的否定判斷。'],['N を Vます','水を飲みます。','喝水。','を 標示動作的對象。'],['場所 で Vます','学校で勉強します。','在學校讀書。','で 表示動作發生的場所。'],['時間 に Vます','七時に起きます。','七點起床。','に 可標示具體時間點。']];
const comics=[
 ['こんにちは！わたしはミカです。','你好！我是 Mika。','こんにちは 是日常打招呼的用語。'],
 ['よろしくお願いします！','請多多指教！','初次認識別人時很常用的禮貌說法。'],
 ['日本語は難しいですか？','日文很難嗎？','難しい（むずかしい）是「困難」的意思。']
];
