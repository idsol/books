<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US">
<head profile="http://gmpg.org/xfn/11">

<?php
	require_once 'config.inc';
	require_once 'Zend/Db.php';
	require_once 'Zend/Db/Table.php';
	
	$bookId = $_REQUEST['id'];
	$db = Zend_Db::factory('mysqli', benet::getConfigs('db'));
	$book = $db->fetchRow('select * from book where bookId=?', $bookId);
?>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<title><?php echo $book['title']; ?> &raquo; Books</title>

<meta name="description" content="作者：Karl Swedberg Jonathan Chaffer|副书名：A comprehensive exploration of the popular JavaScript library|出版日期：2010-1|页数：335|ISBN：978-1-84951-004-2" />
<meta name="keywords" content="javascript,jQuery" />

<link rel="shortcut icon" href="static/images/favicon.ico" />
<link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>

<body>
<div id="pageloading">正在加载...</div>

<div id="container">
	<div id="header">
		<div class="search">
			<form method="get" action="/books/search.php">
				<label class="hidden" for="s">
					<input type="text" value="" size="40" name="s" id="s" />
					<input type="submit" class="f-submit" value="书籍搜索" />
				</label>
			</form>
		</div>
		
		<div class="intro">
			<h1><a href="/books">Books</a></h1>
			<div class="description">&nbsp;</div>
		</div>
		
		<div class="nav">
			<ul class="clearfix">
				<li><a href="/books">首页</a></li>
				<li><a href="/books/dashboard">管理后台</a></li>
			</ul>
		</div>
	</div>
	
	<div class="zoom-mask" id="zoom-mask"></div>
	
	<div id="content" class="widecolumn">
	
	<div class="post-4392789 post hentry category-it tag-javascript tag-jquery" id="post-4392789">
		<div class="sysmsg" id="book-star-msg" style="display:none"></div>
		
		<div class="book-title">
			
		<div class="icon" id="book-star" rel="/favor"></div>
			<h3 class="title">
			<?php
				if (!empty($book)) {
					echo $book['title'];
				} else {
					die('<p>未找到相关图书</p>');
				}
			?>
			</h3>
		</div>
		
		<div class="book-meta">
			<div class="cover">
				<?php
					// 优先查找JPG格式封面及缩略图，如果文件不存在则查找PNG格式
					$coverFile = "covers/$bookId/cover.jpg";
					$thumbFile = "covers/$bookId/thumbnail.jpg";
					if (!file_exists($coverFile)) {
						$coverFile = "covers/$bookId/cover.png";
					}
					if (!file_exists($thumbFile)) {
						$thumbFile = "covers/$bookId/thumbnail.png";
					}
					// 检查封面（大图）是否存在，如果不存在，不提供封面显示
					if (file_exists($coverFile)) {
						echo '<a href="'.$coverFile.'" title="'.$book['title'].'" class="zoom">';
							echo '<img src="'.$thumbFile.'" alt="'.$book['title'].'">';
						echo '</a>';
					}
					else {
						echo '<img src="'.$thumbFile.'" alt="'.$book['title'].'">';
					}
				?>
			</div>
			<div class="info">
				<?php
					if (!empty($book)) {
						echo '<p><span>作者：</span>'.$book['author'].'</p>';
						//-<p><span>副书名：</span>A comprehensive exploration of the popular JavaScript library</p>
						echo '<p><span>出版日期：</span>'.$book['publishDate'].'</p>';
						echo '<p><span>出版社：</span>'.$book['press'].'</p>';
						echo '<p><span>页数：</span>'.$book['pages'].'</p>';
						echo '<p><span>ISBN：</span>'.$book['isbn'].'</p>';
						echo '<p><span>文件格式：</span>'.$book['fileFormat'].'</p>';
						// byte
						if ($book['fileSize'] > 0 && $book['fileSize'] < 1000) {
							echo '<p><span>文件大小：</span>'.$book['fileSize'].'字节 </p>';
						}
						// kilobyte
						else if ($book['fileSize'] >= 1000 && $book['fileSize'] < 1000000) {
							echo '<p><span>文件大小：</span>'.($book['fileSize'] / 1000).' KB</p>';
						}
						// megabyte
						else {
							echo '<p><span>文件大小：</span>'.($book['fileSize'] / 1000000).' MB</p>';
						}
					} else {
						die('<p>未找到相关图书</p>');
					}
				?>
<!--
				<p style="font-weight:bold;">
					<span>在线浏览(测试版)：</span>
					<a href="/pdfpreview/?skey=V1IBMFF%2FVSBTNVU%2BVwtcM1NxA2dcNgVoBWABMg05A2g%3D&page=0" target="_blank" class="preview">jQuery 1.4 Reference Guide</a>
				</p>
				<p>
					<span>本书永久链接：</span>
					<a href="http://www.ppurl.com/2010/02/jquery-1-4-reference-guide.html" target="_blank">http://www.ppurl.com/2010/02/jquery-1-4-reference-guide.html</a>
				</p>
-->
			</div>
		</div>
		
		<h3 class="title">书籍简介</h3>
		<div class="entry format">
			<?php
				/// book intro
				echo '<div class="bookintro">';
				$intro = str_replace(array("\r\n\r\n", "\r\n", "\r", "\n"), "\n", $book['intro']);
				$paras = explode("\n", $intro);
				foreach ($paras as $para) {
					echo '<p>'.$para.'</p>';
				}
				echo '</div>';
				
				/// book tags
				echo '<p>Tags: ';
				$tags = str_replace(', ', ',', $book['tags']);
				$tags = explode(',', $tags);
				$countTags = count($tags);
				foreach ($tags as $i => $tag) {
					echo '<a href="tag.php?t='.$tag.'" rel="tag">'.$tag.'</a>';
					if ($i < $countTags - 1) {
						echo ', ';
					}
				}
				echo '</p>';
			?>
			<p class="postmeta">最后更新时间：2010年02月05日</p>
		</div>
	</div>
	
	<h3 class="title">相关书籍</h3>
	<ul class="related_post">
		<?php
			$relBookShowCount = 8; // 指定相关书籍数量限制
			$tags = $book['tags'];
			$tags = str_replace(', ', ',', $tags);
			$tags = explode(',', $tags);
			if (count($tags) > 0) {
				$whereClause = 'where ';
				foreach ($tags as $idx => $tag) {
					$whereClause .= "tags like '%$tag%'";
					if ($idx < count($tags) - 1) {
						$whereClause .= ' or ';
					}
				}
				$relBooks = $db->fetchAll("select * from book $whereClause limit $relBookShowCount");
				foreach ($relBooks as $relBook) {
					echo '<li><a href="book.php?id='.$relBook['bookId'].'" title="'
						.$relBook['title'].'"><img src="covers/'.$relBook['bookId']
						.'/thumbnail.jpg" /></a></li>';
				}
			}
		?>
	</ul>
</div>

<script src="static/js/jquery.js"></script>
<script src="static/js/utilities.js"></script>
<script src="static/js/core.js"></script>
<script src="static/js/zoom.js"></script>
<script>
YAHOO.util.Event.onDOMReady(function(){
	$D = YAHOO.util.Dom;
	$D.get('pageloading').style.display = 'none';
	KR.app.captcha.init();
	KR.app.showContent.init();
	KR.app.user.favor();
	KR.app.Zoom.init('content');
});
</script>
</body>
</html>
