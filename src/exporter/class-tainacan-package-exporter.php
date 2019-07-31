<?php

/**
 * @author: Vinicius Nunes.
 * Term Exporter
 *
 * Class to export package tainacan
 * 
 * the planning:
 * 
 * Export:
 *	structures
 *		repositories
 *			taxonomies (x)
 *			terms (x)
 *			metadada ()
 *			mapping ()
 *			filters ()
 *		collection
 *			collection ()
 *			metadada ()
 *			mapping ()
 *			filters ()
  *			item ()
 *
 */

namespace Tainacan\Exporter;
use Tainacan;
use Tainacan\Entities;
use Tainacan\Repositories;

class Package_Exporter extends Exporter {

	protected $steps = [
		[
			'name' => 'Check structure',
			'progress_label' => 'Exporting checking structure',
			'callback' => 'checkStructure'
		],
		[
			'name' => 'Taxonomies',
			'progress_label' => 'Exporting taxonomies',
			'callback' => 'exportingTaxonomies'
		],
		[
			'name' => 'Terms',
			'progress_label' => 'Exporting terms',
			'callback' => 'exportingTerms'
		],
		[
			'name' => '',
			'progress_label' => 'Exporting repository metadata',
			'callback' => 'exportingRepositoryMetadata'
		],
		[
			'name' => 'compress package',
			'progress_label' => 'Exporting compressing package',
			'callback' => 'compressPackage'
		]
	];

	public function __construct($attributes = array()){
		parent::__construct($attributes);

		$upload_dir = trailingslashit( wp_upload_dir()['basedir'] );
		$exporter_folder = 'tainacan/exporter';
		$package_folder = "/package";
		$this->final_folder = $upload_dir . $exporter_folder . $package_folder;

		$this->set_default_options([]);
	}

	function str_putcsv($item, $delimiter = ',', $enclosure = '"') {
		// Open a memory "file" for read/write...
		$fp = fopen('php://temp', 'r+');

		fputcsv($fp, $item, $delimiter, $enclosure);
		rewind($fp);
		//Getting detailed stats to check filesize:
		$fstats = fstat($fp);
		$data = fread($fp, $fstats['size']);
		fclose($fp);
		return rtrim($data, "\n");
}

	/**
	 * When exporter is finished, gets the final output
	 */
	public function get_output() {
		return "link to Package;";
	}

	public function options_form() {
		ob_start();
		?>
			<div>
			</div>
		<?php
		return ob_get_clean();
}

	public function process_item($index, $collection_definition) {
			return true;
	}

	public function checkStructure() {
		if (!is_dir($this->final_folder)) {
			if (!mkdir($this->final_folder, 0777, true)) {
				$this->add_error_log( 'Erro on create the folder: ' . $this->final_folder);
				return false;
			}
		}
	}

	public function compressPackage() {

	}

	public function exportingTaxonomies() {
		$taxonomyRepository = Repositories\Taxonomies::get_instance();
		$taxonomies = $taxonomyRepository->fetch();
		if($taxonomies->have_posts()) {
			$fileTaxonomies = "package/tnc_taxonomies";
			$listTaxonomies = [];
			while ($taxonomies->have_posts()) {
				$taxonomies->the_post();
				$taxonomy = new Entities\Taxonomy($taxonomies->post);
				$listTaxonomies[] = $taxonomy->_toJson();
			}
			$this->append_to_file($fileTaxonomies, '[' . \implode(",", $listTaxonomies) . ']', false);
			wp_reset_postdata();
		}
		return true;
	}

	public function exportingTerms() {

		$term_exporte = new Term_Exporter();
		$term_repo = Repositories\Terms::get_instance();
		$taxonomies = Repositories\Taxonomies::get_instance()->fetch();

		if($taxonomies->have_posts()) {
			while ($taxonomies->have_posts()) {
				$taxonomies->the_post();
				$taxonomy = new Entities\Taxonomy($taxonomies->post);
				$file_name = 'package/' . $taxonomy->get_id() . '_' . $taxonomy->get_name() . '_terms.csv';
				$term_exporte->get_terms_recursively( $term_repo, $taxonomy, 0, 0, $file_name, false );
			}
			wp_reset_postdata();
		}
		return true;
	}

	private function exporterMetadata($metadata, $file_output) {
		$this->add_log( 'Exporting repository metadata ID: ' . $metadata->get_id() . $metadata->_toJson() );
		// $array_metadata = [
		// 	$metadata->get_id(),
		// 	$metadata->get_status(),
		// 	$metadata->get_name(),
		// 	$metadata->get_slug(),
		// 	$metadata->get_order(),
		// 	$metadata->get_parent(),
		// 	$metadata->get_description(),
		// 	$metadata->get_required(),
		// 	$metadata->get_multiple(),
		// 	$metadata->get_display(),
		// 	$metadata->get_cardinality(),
		// 	$metadata->get_collection_key(),
		// 	$metadata->get_mask(),
		// 	$metadata->get_default_value(),
		// 	$metadata->get_metadata_type(),
		// 	\json_encode($metadata->get_metadata_type_options())];
		//$line_string = $this->str_putcsv($array_metadata);
		//$line_string = $this->str_putcsv($metadata->_toJson());
		$line_string = $metadata->_toJson();
		$this->append_to_file($file_output, "$line_string\n", false);
	}

	public function exportingRepositoryMetadata() {
		$file_default_metadata = "package/tnc_default_metadata";

		$result = $this->get_transient('result');
		if ($result === null ) {
			$metadatum_repository = Repositories\Metadata::get_instance();
			$args = [
				'meta_query' => [
					[
						'key'     => 'collection_id',
						'value'   => 'default',
						'compare' => '='
					]
				]
			];
			$result = $metadatum_repository->fetch( $args, 'OBJECT' );
		}
		if( empty($result) ) {
			return true;
		}
		$this->exporterMetadata(\array_pop($result), $file_default_metadata);
		$this->add_transient('result', $result );
		return count($result);
	}

}