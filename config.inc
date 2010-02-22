<?php
/**
 * Emulate a namespace 'benet::' to do various tasks
 * @author  sol
 * @created $rev=1$ $date=2009-12-03 16:16$
 * @version $rev=2$ $date=2009-12-15 15:21$
 */

/**
 * @class benet (singleton)
 * Emulate a namespace to do various tasks
 */
class benet
{
	/**
	 * Cached configuration
	 * @type Zend_Config_Xml
	 */
	protected static $__configs = null;
	/**
	 * Acl singleton instance
	 * @type Zend_Acl
	 */
	protected static $__acl = null;
	
	function __construct()
	{
		die('benet is singleton');
	}
	
	/**
	 * 从配置文件中读取并缓存所有配置信息；第二次调用该函数时将从缓存中取值。
	 * @param  mixed  $section  指定区段 [optional,default=null]
	 * @return array  数组形式的配置信息。若$section未指定则为全部配置信息，否则为指定区段部分。
	 * @usage
	 * <pre><code>
	 * benet::getConfigs();		// 获取所有配置信息
	 * benet::getConfigs('db');	// 仅获取数据库的配置信息
	 * </code></pre>
	 */
	static function getConfigs($section = null)
	{
		if (null === self::$__configs) {
			require_once 'Zend/Config/Xml.php';
			self::$__configs = new Zend_Config_Xml(dirname(__FILE__).'/config.xml');
		}
		$configArray = self::$__configs->toArray();
		return $section === null ? $configArray : $configArray[$section];
	}
	
	/**
	 * 格式化浮点数或整数：封装系统函数number_format以简化调用。
	 * @param  float  $number              要进行格式化的浮点数或整数
	 * @param  int    $num_decimal_places  精确到小数点后位数 [optional,default=2]
	 * @return string
	 */
	static function formatNumber($number, $num_decimal_places = 2)
	{
		return number_format($number, $num_decimal_places, '.', '');
	}
	
	/**
	 * 检查指定的用户角色（对指定资源）是否具有指定权限。
	 * @param  Zend_Acl_Role_Interface|string      $role       用户角色
	 * @param  Zend_Acl_Resource_Interface|string  $resource   指定资源
	 * @param  string                              $privilege  指定权限
	 * @return boolean
	 */
	static function isAllowed($role = null, $resource = null, $privilege = null)
	{
		if (null === self::$__acl) {
			require_once 'Zend/Acl.php';
			require_once 'Zend/Acl/Role.php';
			require_once 'Zend/Acl/Resource.php';
			
			self::$__acl = new Zend_Acl();
			
			self::$__acl->addRole(new Zend_Acl_Role('admins'));				// 管理员
			self::$__acl->addRole(new Zend_Acl_Role('guests'));				// 评审监督
			self::$__acl->addRole(new Zend_Acl_Role('experts'), 'guests');	// 评标专家
			
			self::$__acl->addResource(new Zend_Acl_Resource('economy'));	// 经济标
			self::$__acl->addResource(new Zend_Acl_Resource('technical'));	// 技术标
			
			self::$__acl->allow('admins');
			self::$__acl->allow('guests', null, 'view');
			self::$__acl->allow('experts', 'technical', 'edit');
		}
		return self::$__acl->isAllowed($role, $resource, $privilege);
	}
}
?>
