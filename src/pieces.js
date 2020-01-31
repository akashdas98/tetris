import {boardCtx, scale} from './board';

function matrixMultiply(a, b) {
    let c = [
        a[0][0] * b[0] + a[0][1] * b[1],
        a[1][0] * b[0] + a[1][1] * b[1]
    ]
    return c;
}

const pieces = {  
    createPiece(matrix, pivot, id, color) {
        let orientation = 0;
        function setPivot(x, y) {
            pivot = [x, y];
        }
        function getPivot() {
            return pivot;
        }
        function getMatrix() {
            return matrix;
        }
        function getColor() {
            return color;
        }
        function draw() {
            boardCtx.fillStyle = color;
            boardCtx.strokeStyle = '#000000';
            matrix.forEach(tile => {
                boardCtx.globalAlpha = 1;
                boardCtx.fillRect((tile[0] + pivot[0]) * scale, (tile[1] + pivot[1])* scale, scale, scale);
                boardCtx.globalAlpha = 0.5;
                boardCtx.strokeRect((tile[0] + pivot[0]) * scale, (tile[1] + pivot[1])* scale, scale, scale);
            });
        }
        function rotate(dir, boardMatrix) {
            if(id === 'O') return;
            let rotation;
            if(dir === 0) {
                rotation = [
                    [0, 1],
                    [-1, 0]
                ];
            } else {
                rotation = [
                    [0, -1],
                    [1, 0]
                ];
            }
            let rotated;
            let kick = false;
            function changeOrientation() {
                orientation = dir == 1? ((orientation + 1) % 4 + 4) % 4 : ((orientation - 1) % 4 + 4) % 4;
            }
            function checkKick(x, y) {
                kick = false;
                for(let i = 0; i < rotated.length; i++) {
                    if(rotated[i][0] + pivot[0] + x < 0 || rotated[i][0] + pivot[0] + x > 9 || rotated[i][1] + pivot[1] + y > 19) {
                        kick = true;
                        break;
                    } else if(boardMatrix[rotated[i][0] + pivot[0] + x][rotated[i][1] + pivot[1] + y].value === 1) {
                        kick = true;
                        break;
                    }
                }
            }
            function doKick(x, y) {
                matrix = rotated;
                pivot[0] += x;
                pivot[1] += y;
                changeOrientation();
            }
            
            rotated = matrix.map(tile => {
                return matrixMultiply(rotation, tile);
            });
            if(id === 'I') {
                if(orientation === 0) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-2, 0);
                            if(!kick) {
                                doKick(-2, 0);
                            } else {
                                checkKick(1, 0);
                                if(!kick) {
                                    doKick(1, 0);
                                } else {
                                    checkKick(-2, -1);
                                    if(!kick) {
                                        doKick(-2, -1);
                                    } else {
                                        checkKick(1, 2);
                                        if(!kick) {
                                            doKick(1, 2);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-1, 0);
                            if(!kick) {
                                doKick(-1, 0);
                            } else {
                                checkKick(2, 0);
                                if(!kick) {
                                    doKick(2, 0);
                                } else {
                                    checkKick(-1, 2);
                                    if(!kick) {
                                        doKick(-1, 2);
                                    } else {
                                        checkKick(2, -1);
                                        if(!kick) {
                                            doKick(2, -1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if(orientation === 1) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-1, 0);
                            if(!kick) {
                                doKick(-1, 0);
                            } else {
                                checkKick(2, 0);
                                if(!kick) {
                                    doKick(2, 0);
                                } else {
                                    checkKick(-1, 2);
                                    if(!kick) {
                                        doKick(-1, 2);
                                    } else {
                                        checkKick(2, -1);
                                        if(!kick) {
                                            doKick(2, -1);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(2, 0);
                            if(!kick) {
                                doKick(2, 0);
                            } else {
                                checkKick(-1, 0);
                                if(!kick) {
                                    doKick(-1, 0);
                                } else {
                                    checkKick(2, 1);
                                    if(!kick) {
                                        doKick(2, 1);
                                    } else {
                                        checkKick(-1, -2);
                                        if(!kick) {
                                            doKick(-1, -2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if(orientation === 2) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(2, 0);
                            if(!kick) {
                                doKick(2, 0);
                            } else {
                                checkKick(-1, 0);
                                if(!kick) {
                                    doKick(-1, 0);
                                } else {
                                    checkKick(2, 1);
                                    if(!kick) {
                                        doKick(2, 1);
                                    } else {
                                        checkKick(-1, -2);
                                        if(!kick) {
                                            doKick(-1, -2);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(1, 0);
                            if(!kick) {
                                doKick(1, 0);
                            } else {
                                checkKick(-2, 0);
                                if(!kick) {
                                    doKick(-2, 0);
                                } else {
                                    checkKick(1, -2);
                                    if(!kick) {
                                        doKick(1, -2);
                                    } else {
                                        checkKick(-2, 1);
                                        if(!kick) {
                                            doKick(-2, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if(orientation === 3) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(1, 0);
                            if(!kick) {
                                doKick(1, 0);
                            } else {
                                checkKick(-2, 0);
                                if(!kick) {
                                    doKick(-2, 0);
                                } else {
                                    checkKick(1, -2);
                                    if(!kick) {
                                        doKick(1, -2);
                                    } else {
                                        checkKick(-2, 1);
                                        if(!kick) {
                                            doKick(-2, 1);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-2, 0);
                            if(!kick) {
                                doKick(-2, 0);
                            } else {
                                checkKick(1, 0);
                                if(!kick) {
                                    doKick(1, 0);
                                } else {
                                    checkKick(-2, -1);
                                    if(!kick) {
                                        doKick(-2, -1);
                                    } else {
                                        checkKick(1, 2);
                                        if(!kick) {
                                            doKick(1, 2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if(orientation === 0) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-1, 0);
                            if(!kick) {
                                doKick(-1, 0);
                            } else {
                                checkKick(-1, 1);
                                if(!kick) {
                                    doKick(-1, 1);
                                } else {
                                    checkKick(0, -2);
                                    if(!kick) {
                                        doKick(0, -2);
                                    } else {
                                        checkKick(-1, -2);
                                        if(!kick) {
                                            doKick(-1, -2);
                                        }
                                    }
                                }
                            }    
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(1, 0);
                            if(!kick) {
                                doKick(1, 0);
                            } else {
                                checkKick(1, 1);
                                if(!kick) {
                                    doKick(1, 1);
                                } else {
                                    checkKick(0, -2);
                                    if(!kick) {
                                        doKick(0, -2);
                                    } else {
                                        checkKick(1, -2);
                                        if(!kick) {
                                            doKick(1, -2);
                                        }
                                    }
                                }
                            }    
                        }
                    }
                } else if(orientation === 1) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(1, 0);
                            if(!kick) {
                                doKick(1, 0);
                            } else {
                                checkKick(1, -1);
                                if(!kick) {
                                    doKick(1, -1);
                                } else {
                                    checkKick(0, 2);
                                    if(!kick) {
                                        doKick(0, 2);
                                    } else {
                                        checkKick(1, 2);
                                        if(!kick) {
                                            doKick(1, 2);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(1, 0);
                            if(!kick) {
                                doKick(1, 0);
                            } else {
                                checkKick(1, -1);
                                if(!kick) {
                                    doKick(1, -1);
                                } else {
                                    checkKick(0, 2);
                                    if(!kick) {
                                        doKick(0, 2);
                                    } else {
                                        checkKick(1, 2);
                                        if(!kick) {
                                            doKick(1, 2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if(orientation === 2) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(1, 0);
                            if(!kick) {
                                doKick(1, 0);
                            } else {
                                checkKick(1, 1);
                                if(!kick) {
                                    doKick(1, 1);
                                } else {
                                    checkKick(0, -2);
                                    if(!kick) {
                                        doKick(0, -2);
                                    } else {
                                        checkKick(1, -2);
                                        if(!kick) {
                                            doKick(1, -2);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-1, 0);
                            if(!kick) {
                                doKick(-1, 0);
                            } else {
                                checkKick(-1, 1);
                                if(!kick) {
                                    doKick(-1, 1);
                                } else {
                                    checkKick(0, -2);
                                    if(!kick) {
                                        doKick(0, -2);
                                    } else {
                                        checkKick(-1, -2);
                                        if(!kick) {
                                            doKick(-1, -2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if(orientation === 3) {
                    if(dir === 1) {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-1, 0);
                            if(!kick) {
                                doKick(-1, 0);
                            } else {
                                checkKick(-1, -1);
                                if(!kick) {
                                    doKick(-1, -1);
                                } else {
                                    checkKick(0, 2);
                                    if(!kick) {
                                        doKick(0, 2);
                                    } else {
                                        checkKick(-1, 2);
                                        if(!kick) {
                                            doKick(-1, 2);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        checkKick(0, 0);
                        if(!kick) {
                            doKick(0, 0);
                        } else {
                            checkKick(-1, 0);
                            if(!kick) {
                                doKick(-1, 0);
                            } else {
                                checkKick(-1, -1);
                                if(!kick) {
                                    doKick(-1, -1);
                                } else {
                                    checkKick(0, 2);
                                    if(!kick) {
                                        doKick(0, 2);
                                    } else {
                                        checkKick(-1, 2);
                                        if(!kick) {
                                            doKick(-1, 2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            draw, 
            setPivot, 
            getPivot, 
            getMatrix, 
            rotate, 
            getColor,
        };
    },
    
    createTPiece(x, y) {
        const id = 'T';
        const color = '#ff00ff';
        let matrix = [
            [0, - 1],
            [- 1, 0],
            [0, 0],
            [1, 0],
        ];
        const TPiece = this.createPiece(matrix, [x, y], id, color);
        return TPiece;
    },
    
    createIPiece(x, y) {
        const id = 'I';
        const color = '#00ffff';
        let matrix = [
            [- 1.5, 0.5],
            [- 0.5, 0.5],
            [0.5, 0.5],
            [1.5, 0.5],
        ];
        const IPiece = this.createPiece(matrix, [x, y], id, color);
        return IPiece;
    },
    
    createJPiece(x, y) {
        const id = 'J';
        const color = '#0000ff';
        let matrix = [
            [- 1, 0],
            [0, 0],
            [1, 0],
            [-1, -1],
        ];
        const JPiece = this.createPiece(matrix, [x, y], id, color);
        return JPiece;
    },
    
    createLPiece(x, y) {
        const id = 'L';
        const color = '#ff7f00';
        let matrix = [
            [-1, 0],
            [0, 0],
            [1, 0],
            [1, -1],
        ];
        const LPiece = this.createPiece(matrix, [x, y], id, color);
        return LPiece;
    },
    
    createSPiece(x, y) {
        const id = 'S';
        const color = '#00ff00';
        let matrix = [
            [-1, 0],
            [0, 0],
            [0, -1],
            [1, -1],
        ];
        const SPiece = this.createPiece(matrix, [x, y], id, color, boardCtx, scale);
        return SPiece;
    },
    
    createOPiece(x, y) {
        const id = 'O';
        const color = '#ffff00';
        let matrix = [
            [-1, 0],
            [0, 0],
            [-1, -1],
            [0, -1],
        ];
        const OPiece = this.createPiece(matrix, [x, y], id, color);
        return OPiece;
    },
    
    createZPiece(x, y) {
        const id = 'Z';
        const color = '#ff0000';
        let matrix = [
            [-1, -1],
            [0, 0],
            [0, -1],
            [1, 0],
        ];
        const ZPiece = this.createPiece(matrix, [x, y], id, color);
        return ZPiece;
    },
}

export default pieces;