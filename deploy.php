<?php

namespace Deployer;

require 'recipe/common.php';

set('application', 'phala-stats');
set('repository', 'git@github.com:l00k/phala-tools-ui.git');

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


host('phala')
    ->hostname('ovh-server')
    ->user('ubuntu')
    ->set('deploy_path', '/var/www/phala.100k.dev');

host('khala')
    ->hostname('ovh-server')
    ->user('ubuntu')
    ->set('deploy_path', '/var/www/khala.100k.dev');


desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'custom:asset_build',
    'custom:file_upload',
    'deploy:shared',
    'deploy:writable',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success',
]);

after('deploy:failed', 'deploy:unlock');


task('custom:asset_build', function () {
    if (!empty(get('assets_path', false))) {
        $assetsPath = trim(get('assets_path'), '/\\');
        runLocally('cd ./' . $assetsPath . ' && yarn build');
    }
});

task('custom:file_upload', function () {
    $random = uniqid();
    $compressedFilename = "package-$random.tar.gz";

    $cmd = 'cd ./dist && tar -zcf ../' . $compressedFilename . ' .';
    runLocally($cmd);

    $releaseDir = test('[ -L {{deploy_path}}/release ]')
        ? 'release'
        : 'current';
    $distPath = get('deploy_path') . '/' . $releaseDir;

    upload('./' . $compressedFilename, $distPath);
    runLocally('rm ' . $compressedFilename);

    run('cd ' . $distPath . ' && tar -xf ' . $compressedFilename);
    run('cd ' . $distPath . ' && rm -f ' . $compressedFilename);
});

task('deploy:shared:copy', function () {
    $sharedPath = "{{deploy_path}}/shared";

    foreach (get('shared_files:copy') as $file) {
        $dirname = dirname(parse($file));

        if (!test("[ -d {$sharedPath}/{$dirname} ]")) {
            run("mkdir -p {$sharedPath}/{$dirname}");
        }

        if (!test("[ -f $sharedPath/$file ]") && test("[ -f {{release_path}}/$file ]")) {
            run("cp -rv {{release_path}}/$file $sharedPath/$file");
        }

        run("if [ -f $(echo {{release_path}}/$file) ]; then rm -rf {{release_path}}/$file; fi");
        run("if [ ! -d $(echo {{release_path}}/$dirname) ]; then mkdir -p {{release_path}}/$dirname;fi");
        
        run("touch $sharedPath/$file");

        run("cp -r $sharedPath/$file {{release_path}}/$file");
    }
});
