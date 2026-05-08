
# script will visit each of the packages and npm run build that will
# recompile into javascript files in the packages dist folder.

# because of dependencies, the order in which the packages are built is 
# significant
for PACKNAME in manifesto-prezi4 x3d_transforms manifest_viewer ; do
    ( 
        cd ./packages/$PACKNAME ;
        npm run build;
    ) done;
