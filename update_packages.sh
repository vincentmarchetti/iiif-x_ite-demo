
# script will visit each of the packages and update, really means
# sychronize the commit in that packages to what has been saved in the
# submodule entry of the package 

# useful to do this after checking out a different branch in case a development branch
# is using a development branch of a subpackage

for PACKNAME in manifesto-prezi4 x3d_transforms manifest_viewer ; do
    git submodule update ./packages/$PACKNAME;
done;

sh ./build_packages.sh
