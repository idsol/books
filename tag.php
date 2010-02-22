<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US">
<head profile="http://gmpg.org/xfn/11">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />

<?php
$tag = $_REQUEST['t'];
$pageNo = isset($_REQUEST['p']) ? $_REQUEST['p'] : 1;
?>

<title><?php echo $tag ?> &raquo; Books</title>
<link rel="shortcut icon" href="static/images/favicon.ico" />
<link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>

<body>
<div id='pageloading'>正在加载...</div>

<div id="container">
	<div id="header">
		<div class="search"><form method="get" action="/books/search.php">
	<label class="hidden" for="s">
	<input type="text" value="" size="40" name="s" id="s" />
	<input type="submit" class="f-submit" value="书籍搜索" /></label>
</form>

</div>

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
		<?php
			require_once 'config.inc';
			require_once 'Zend/Db.php';
			require_once 'Zend/Db/Table.php';
			
			$db = Zend_Db::factory('mysqli', benet::getConfigs('db'));
			$books = $db->fetchAll("select * from book where tags like '%$tag%'");
			
			// 分页
			$totalCount = count($books);
			$itemPerPage = 4;
		?>
  		<h3 class="title">含有 <span class="tag"><?php echo $tag ?></span> 标签的书籍 [<?php echo $totalCount ?>]</h3>
  		<div id="search-book-list">
			<ul>
				<?php
					// 分页
					for ($i = 0; $i < $itemPerPage; $i++) {
						$bookIndex = (($pageNo-1) * $itemPerPage) + $i;
						if ($bookIndex >= $totalCount || $bookIndex < 0) {
							break;
						}
						$book = $books[$bookIndex];
						echo '<li class="post hentry category-it tag-jquery">';
						echo '<div class="book-meta">';
							echo '<div class="cover">';
								echo '<a href="/books/book.php?id='.$book['bookId'].'" title="'.$book['title'].'">';
									echo '<img src="covers/'.$book['bookId'].'/thumbnail.jpg" alt="'.$book['title'].'">';
								echo '</a>';
							echo '</div>';
							echo '<div class="info">';
								echo '<p><span>书名：</span><a href="/books/book.php?id='.$book['bookId'].'">'.$book['title'].'</a></p>';
								echo '<p><span>作者：</span>'.$book['author'].'</p>';
								echo '<p><span>出版日期：</span>'.$book['publishDate'].'</p>';
								echo '<p><span>出版社：</span>'.$book['press'].'</p>';
								echo '<p><span>页数：</span>'.$book['pages'].'</p>';
								echo '<p><span>ISBN：</span>'.$book['isbn'].'</p>';
								//- echo '<p>index: '.$bookIndex.'</p>';
							echo '</div>';
						echo '</div>';
						echo '</li>';
					}
				?>
			</ul>
		</div>
		<div class="navigation">
			<?php
				$prevPageNo = intval($pageNo) - 1;
				$nextPageNo = intval($pageNo) + 1;
				// has previous page?
				if ($pageNo > 1) {
					echo '<a href="/books/tag.php?t='.$tag.'&p='.$prevPageNo.'">&laquo; 上一页</a>';
				}
				// is there more?
				if (($totalCount - 1) > $pageNo * $itemPerPage) {
					echo '<a href="/books/tag.php?t='.$tag.'&p='.$nextPageNo.'">&raquo; 下一页</a>';
				}
			?>
		</div>
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
