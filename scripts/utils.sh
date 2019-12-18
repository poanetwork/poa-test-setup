#!/bin/bash

function checkclientversion()
{
	parityversionoutput=$(parity --version)

	parityversion=$(echo $parityversionoutput | cut -d'-' -f 2 | cut -d'/' -f 2 | cut -d'v' -f 2) 
	major=$(echo $parityversion | cut -d'.' -f 1)
	minor=$(echo $parityversion | cut -d'.' -f 2)
	patch=$(echo $parityversion | cut -d'.' -f 3)

	majormin=2
	minormin=6
	patchmin=5

	errormsg="Parity Ethereum client version should be more or equal to v2.6.5. Your current installation has version $parityversion"

	function genError()
	{
		echo $errormsg
		exit 0
	}

	if [ $major -lt $majormin ];
	then
		genError
	elif [ $major -eq $majormin ] && [ $minor -lt $minormin ];
	then
		genError
	elif [ $major -eq $majormin ] && [ $minor -eq $minormin ] && [ $patch -lt $patchmin ];
	then
		genError
	fi

	echo ""
	exit 0
}