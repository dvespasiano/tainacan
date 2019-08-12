<?php

namespace Tainacan\Traits;

trait Query_Cache {
	
	protected $QueryCache = [];
	protected $queries = 0;
	protected $cached = 0;
	
	protected function add_cache($repository, $query_args, $result) {
		$query_hash = $this->build_query_hash($query_args);
		$this->QueryCache[$repository][$query_hash] = $result;
	}
	
	protected function get_cache($repository, $query_args) {
		
		$query_hash = $this->build_query_hash($query_args);
		$this->queries ++;
		//\error_log('Total queries: ' . $this->queries);
		//return false;
		if ( isset($this->QueryCache[$repository][$query_hash]) ) {
			$this->cached ++;
			//\error_log('Served from cache: ' . $this->cached);
			return $this->QueryCache[$repository][$query_hash];
		}
		
		return false;
		
	}
	
	public function clear_cache($repository = null) {
		if ( is_null($repository) ) {
			$this->QueryCache = [];
		} else {
			if ( isset($this->QueryCache[$repository]) ) {
				unset($this->QueryCache[$repository]);
			}
		}
		
	}
	
	private function build_query_hash($query_args) {
		$cur_user = wp_get_current_user();
		if (is_object($cur_user) && isset($cur_user->allcaps)) {
			$caps = $cur_user->allcaps;
			$query_args['caps'] = $caps;
		}
		return md5(serialize($query_args));
	}
	    
}
