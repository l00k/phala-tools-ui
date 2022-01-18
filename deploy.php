<?php

namespace Deployer;

require 'recipe/common.php';

set('application', 'phala-stats');
set('repository', 'git@github.com:l00k/phala-stats-ui.git');

set('git_tty', true);
set('allow_anonymous_stats', false);

set('assets_path', '/');
set('clear_paths', [
    'patches',
    'public',
    'src',
]);
set('shared_files:copy', [
    'src/etc/local/config.ts',
]);
set('copy_dirs', [
    'node_modules',
]);


host('main')
    ->hostname('100k-dev-server')
    ->user('ubuntu')
    ->set('deploy_path', '/var/www/phala.100k.dev');


desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:shared:copy',
    'deploy:copy_dirs',
    'deploy:writable',
    'deploy:clear_paths',
    'custom:build',
    'deploy:symlink',
    'cleanup',
    'success'
]);

after('deploy:failed', 'deploy:unlock');


task('custom:build', function () {

});
