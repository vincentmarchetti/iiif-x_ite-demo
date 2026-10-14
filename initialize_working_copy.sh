npm install

for PACKNAME in manifesto-prezi4 x3d_transforms manifest_viewer ; do
    git submodule update --init ./packages/$PACKNAME;
    npm install --prefix ./packages/$PACKNAME
done;

sh ./build_packages.sh
