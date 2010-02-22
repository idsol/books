<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml" dir="ltr">
<head profile="http://gmpg.org/xfn/11">

<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
<meta content="IE=EmulateIE7" http-equiv="X-UA-Compatible">

<title>Books</title>

<link href="static/images/favicon.ico" rel="shortcut icon">
<link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>

<body>
<div id="pageloading">正在加载...</div>

<?php
require_once 'config.inc';
require_once 'Zend/Db.php';
require_once 'Zend/Db/Table.php';

$db = Zend_Db::factory('mysqli', benet::getConfigs('db'));
$homeBookList = $db->fetchAll('select * from book order by bookId desc limit 8');
?>

<div id="container">
	<div id="header">
		<div class="intro">
			<h1><a href="/">Books</a></h1>
			<div class="description">&nbsp;</div>
		</div>
		<div class="nav">
			<ul class="clearfix">
				<li><a href="/books">首页</a></li>
				<li><a href="/books/dashboard">管理后台</a></li>
			</ul>
		</div>
	</div>

	<div id="content">
		
		<div id="search-form">
			<form action="/books/search.php" method="get">
				<label for="s" class="hidden">
					<input type="text" id="s" name="s" size="40" value="">
					<input type="submit" value="书籍搜索" class="f-submit">
				</label>
			</form>
		</div>
		
		<h3 class="title">最新添加</h3>
		<!--图书列表开始-->
		<div id="home-book-list">
			<ul>
				<?php
					// 首页图书列表：按bookId倒序选择最后的8条记录
					foreach ($homeBookList as $homeBook) {
						echo '<li><a title="'.$homeBook['title'].'" href="/books/book.php?id='.$homeBook['bookId'].'"><img alt="'.$homeBook['title'].'" src="covers/'.$homeBook['bookId'].'/thumbnail.jpg" /></a></li>';
					}
				?>
			</ul>
		</div>
		<!--图书列表结束-->
		<h3 class="title">标签</h3>
		<div class="tag-cloud" id="tag-cloud">
			<?php
				$recs = $db->fetchAll('select tags from book');
				$tags = array();
				foreach ($recs as $rec) {
					$tagsInRec = $rec['tags'];
					$tagsInRec = str_replace(', ', ',', $tagsInRec);
					$tagsInRec = explode(',', $tagsInRec);
					foreach ($tagsInRec as $tag) {
						$tags[] = $tag;
					}
				}
				$tags = array_unique($tags);
				foreach ($tags as $tag) {
					echo '<a style="font-size:11pt" href="/books/tag.php?t='.$tag.'">'.$tag.'</a>';
				}
			?>
<!--
			<a style="font-size: 9.83178pt;" title="21 本" class="tag-link-3" href="http://www.ppurl.com/tag/database">数据库</a>
			<a style="font-size: 11.4019pt;" title="28 本" class="tag-link-13" href="http://www.ppurl.com/tag/game">游戏设计与编程</a>
			<a style="font-size: 9.83178pt;" title="21 本" class="tag-link-7" href="http://www.ppurl.com/tag/network">网络与通信</a>
-->
		</div>
	</div>

<script src="static/js/utilities.js"></script>
<script src="static/js/core.js"></script>
<script>
YAHOO.util.Event.onDOMReady(function(){
	$D = YAHOO.util.Dom;
	$D.get('pageloading').style.display = 'none';
});
</script>

</body>
</html>